import {
  Controller,
  Get,
  Header,
  Query,
  Hidden,
  Route,
} from 'tsoa'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader } from '../constants'
import { Template } from './template'

interface URLResponse {
  url: string
}

@Route('urls')
export class connectionController extends Controller {
  @Get()
  @Hidden()
  public async getURL(
    @Header(openAIConversationIDHeader) @Hidden() conversationID: string,
    @Header('template') template: Template = 'Nodejs',
    @Query() port?: number,
  ): Promise<URLResponse> {
    const session = await CachedSession
      .findOrStartSession({ sessionID: conversationID, envID: template })

    const url = session.session.getHostname(port)

    return {
      url: url!
    }
  }
}
