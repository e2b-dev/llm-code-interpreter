import {
  components as devbookAPIComponents,
} from '@devbookhq/sdk'

export type Environment = devbookAPIComponents['schemas']['Template']

export const defaultEnvironment: Environment = 'Nodejs'

export function getUserSessionID(conversationID: string | undefined, env: Environment) {
  if (!conversationID) {
    throw new Error('conversationID in header is required')
  }
  return `${conversationID}-${env}`
}
