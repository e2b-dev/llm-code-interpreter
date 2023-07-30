import {
  Body,
  Controller,
  Post,
  Header,
  Route,
  Consumes,
  Query,
} from 'tsoa'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader, textPlainMIME } from '../constants'
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
export class commandController extends Controller {
  /**
   * @summary Run a command in a shell
   * 
   * @param envID Environment to run the command in
   * @param command Command to run
   * @param workDir Working directory to run the command in
   * @returns JSON containing the standard output and error output of the command
   */
  @Post()
  @Consumes(textPlainMIME)
  public async runCommand(
    @Body() command: string,
    @Query() workDir: string,
    @Header('env') envID: Environment = defaultEnvironment,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ): Promise<CommandResponse> {
    const sessionID = getUserSessionID(conversationID, envID)
    const session = await CachedSession.findOrStartSession({ sessionID, envID })

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
