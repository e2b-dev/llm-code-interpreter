import {
  Controller,
  Get,
  Put,
  Header,
  Query,
  Route,
  Hidden,
  Consumes,
  Body,
  Produces,
} from 'tsoa'
import { dirname } from 'path'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader, textPlainMIME } from '../constants'
import { Template, defaultTemplate, getUserSessionID } from './template'


@Route('files')
export class FilesystemController extends Controller {
  @Get()
  @Produces(textPlainMIME)
  public async readFile(
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
    @Header() template: Template = defaultTemplate,
    @Query() path: string,
  ): Promise<string> {
    const sessionID = getUserSessionID(conversationID, template)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: template })

    this.setHeader('Content-Type', textPlainMIME)

    return await session
      .session
      .filesystem!
      .read(path)
  }

  @Put()
  @Consumes(textPlainMIME)
  public async writeFile(
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
    @Header() template: Template = defaultTemplate,
    @Query() path: string,
    @Body() content: string,
  ) {
    const sessionID = getUserSessionID(conversationID, template)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: template })

    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}