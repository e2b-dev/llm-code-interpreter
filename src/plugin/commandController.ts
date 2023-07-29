import {
  Body,
  Controller,
  Post,
  Header,
  Route,
  Hidden,
  Consumes,
  Query,
} from 'tsoa'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader, textPlainMIME } from '../constants'
import { Template, defaultTemplate, getUserSessionID } from './template'

interface ExecuteCommandResponse {
  stderr: string
  stdout: string
}

@Route('commands')
export class commandController extends Controller {
  @Post()
  @Consumes(textPlainMIME)
  public async executeCommand(
    @Body() command: string,
    @Query() workDir: string,
    @Header() template: Template = defaultTemplate,
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
  ): Promise<ExecuteCommandResponse> {
    const sessionID = getUserSessionID(conversationID, template)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: template })

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
