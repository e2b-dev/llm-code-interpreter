import {
  Controller,
  Get,
  Put,
  Header,
  Query,
  Route,
  Consumes,
  Body,
  Produces,
} from 'tsoa'
import { dirname } from 'path'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader, textPlainMIME } from '../constants'
import { Environment, defaultEnvironment, getUserSessionID } from './environment'


@Route('files')
export class FilesystemController extends Controller {
  @Get()
  @Produces(textPlainMIME)
  public async readFile(
    @Header('env') envID: Environment = defaultEnvironment,
    @Query() path: string,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ): Promise<string> {
    const sessionID = getUserSessionID(conversationID, envID)
    const session = await CachedSession.findOrStartSession({ sessionID, envID })

    this.setHeader('Content-Type', textPlainMIME)

    return await session
      .session
      .filesystem!
      .read(path)
  }

  @Put()
  @Consumes(textPlainMIME)
  public async writeFile(
    @Header('env') envID: Environment = defaultEnvironment,
    @Query() path: string,
    @Body() content: string,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ) {
    const sessionID = getUserSessionID(conversationID, envID)
    const session = await CachedSession.findOrStartSession({ sessionID, envID })
    
    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}