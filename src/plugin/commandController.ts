import {
  Controller,
  Post,
  Header,
  BodyProp,
  Route,
  Query,
} from 'tsoa'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader } from '../constants'
import { Environment, defaultEnvironment, getUserSessionID } from './environment'

/**
 *
 */
interface CommandResponse {
  /**
   * Standard error output from the command
   */
  stderr: string
  /**
   * Standard output from the command
   */
  stdout: string
}

@Route('commands')
export class CommandController extends Controller {
  /**
   * @summary Run a command in a shell
   * 
   * @param env Environment to run the command in
   * @param command Command to run
   * @param workDir Working directory to run the command in
   * @returns JSON containing the standard output and error output of the command
   */
  @Post()
  public async runCommand(
    @BodyProp() command: string,
    @BodyProp() workDir: string,
    @Query() env: Environment = defaultEnvironment,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ): Promise<CommandResponse> {
    const sessionID = getUserSessionID(conversationID, env)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: env })

    const cachedProcess = await session.startProcess({
      cmd: command,
      rootdir: workDir,
    })

    await cachedProcess.process?.exited

    return {
      stderr: cachedProcess.response.stderr.map(({ line }) => line).join('\n'),
      stdout: cachedProcess.response.stdout.map(({ line }) => line).join('\n'),
    }
  }
}
