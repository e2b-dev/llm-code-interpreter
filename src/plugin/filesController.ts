import {
  Controller,
  Get,
  Put,
  Header,
  Query,
  Route,
  Hidden,
  BodyProp,
} from 'tsoa'
import { dirname } from 'path'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader } from '../constants'
import { Template } from './template'

interface ReadFileResponse {
  content: string
}

@Route('files')
export class FilesystemController extends Controller {
  @Get()
  public async readFile(
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
    @Header('template') template: Template = 'Nodejs',
    @Query() path: string,
  ): Promise<ReadFileResponse> {
    const session = await CachedSession.findOrStartSession({ sessionID: conversationID, envID: template })

    const content = await session
      .session
      .filesystem!
      .read(path)

    return {
      content,
    }
  }

  @Put()
  public async writeFile(
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
    @Header('template') template: Template = 'Nodejs',
    @Query() path: string,
    @BodyProp() content: string,
  ) {
    const session = await CachedSession.findOrStartSession({ sessionID: conversationID, envID: template })

    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}