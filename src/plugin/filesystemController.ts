import {
  Controller,
  Get,
  Put,
  Header,
  Query,
  Route,
  BodyProp,
} from 'tsoa'
import { dirname } from 'path'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader } from '../constants'
import { Template } from './template'

interface ReadFilesystemFileResponse {
  content: string
}

@Route('filesystem')
export class FilesystemController extends Controller {
  @Get('file')
  public async readFile(
    @Header(openAIConversationIDHeader) conversationID: string,
    @Header('template') template: Template,
    @Query() path: string,
  ): Promise<ReadFilesystemFileResponse> {
    const session = await CachedSession.findOrStartSession({ sessionID: conversationID, envID: template })

    const content = await session
      .session
      .filesystem!
      .read(path)

    return {
      content,
    }
  }

  @Put('file')
  public async writeFile(
    @Header(openAIConversationIDHeader) conversationID: string,
    @Header('template') template: Template,
    @Query() path: string,
    @BodyProp() content: string,
  ) {
    const session = await CachedSession.findOrStartSession({ sessionID: conversationID, envID: template })

    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}