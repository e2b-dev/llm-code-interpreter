import { OpenedPort as OpenPort, Session } from '@devbookhq/sdk'
import NodeCache from 'node-cache'

import { CachedProcess, RunProcessParams } from './process'
import { maxSessionLength } from '../constants'

export const sessionCache = new NodeCache({
  stdTTL: maxSessionLength,
  checkperiod: 10,
  useClones: false,
  deleteOnExpire: true,
})

sessionCache.on('expired', async function (_, cached: CachedSession) {
  try {
    await cached.delete()
  } catch (err) {
    console.error(err)
  }
})

export class CachedSession {
  private readonly cachedProcesses: CachedProcess[] = []

  private closed = false

  ports: OpenPort[] = []

  id?: string
  cacheID?: string
  session: Session

  /**
   * You must call `.init()` to start the session.
   * 
   * @param envID 
   */
  constructor(envID: string) {
    this.session = new Session({
      id: envID,
      apiKey: process.env.E2B_API_KEY,
      onClose: () => {
        this.delete()
      },
      codeSnippet: {
        onScanPorts: (ports) => {
          // We need to remap the ports because there is a lot of hidden properties
          // that breaks the generated API between client and server.
          this.ports = ports.map(p => ({
            Ip: p.Ip,
            Port: p.Port,
            State: p.State,
          }))
        },
      },
    })
  }

  /**
   * @param customCacheID If you want to use a custom cache ID instead of the default one
   */
  async init(customCacheID?: string) {
    await this.session.open()
    
    const url = this.session.getHostname()
    if (!url) throw new Error('Cannot start session')
    console.log('Opened session',  url)

    const [id] = url.split('.')
    this.id = id
    this.cacheID = customCacheID || id
    sessionCache.set(this.cacheID, this)

    // Temporary hack to fix the clock drift issue for Alpine Linux
    this.session.filesystem?.write('/etc/chrony/chrony.conf', `initstepslew 0.5 pool.ntp.org
    makestep 0.5 -1`).then(() => {
      this.startProcess({
        cmd: `rc-service chronyd restart`,
      })
    })

    return this
  }

  async delete() {
    if (!this.cacheID) return
    if (this.closed) return
    this.closed = true

    await this.session.close()
    sessionCache.del(this.cacheID)
  }

  async stopProcess(processID: string) {
    const cachedProcess = this.findProcess(processID)
    if (!cachedProcess) return

    await cachedProcess.process?.kill()
    const idx = this.cachedProcesses.findIndex(p => p.process?.processID === processID)
    if (idx !== -1) {
      this.cachedProcesses.splice(idx, 1)
    }

    return cachedProcess
  }

  findProcess(processID: string) {
    return this.cachedProcesses.find(p => p.process?.processID === processID)
  }

  async startProcess(params: RunProcessParams) {
    if (!this.session.process) throw new Error('Session is not open')

    const cachedProcess = new CachedProcess(this.session.process)
    await cachedProcess.start(params)
    this.cachedProcesses.push(cachedProcess)

    return cachedProcess
  }

  static async findOrStartSession({ sessionID, envID }: { sessionID: string, envID: string }) {
    try {
      return CachedSession.findSession(sessionID)
    } catch {
      const cachedSession = new CachedSession(envID)
      await cachedSession.init(sessionID)
      return cachedSession
    }
  }

  static findSession(id: string) {
    const cachedSession = sessionCache.get(id) as CachedSession
    if (!cachedSession) throw new Error('Session does not exist')
    return cachedSession
  }
}
