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
  /**
   * @summary Read the contents of a file at the given path
   * 
   * @param env Environment where to read the file from
   * @param path Path to the file to read
   * @returns Contents of the file as a string
   */
  @Get()
  @Produces(textPlainMIME)
  public async readFile(
    @Query() env: Environment = defaultEnvironment,
    @Query() path: string,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ): Promise<string> {
    const sessionID = getUserSessionID(conversationID, env)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: env })

    this.setHeader('Content-Type', textPlainMIME)

    return await session
      .session
      .filesystem!
      .read(path)
  }

  /**
   * @summary Write content to a file at the given path
   * 
   * @param env Environment where to write the file
   * @param path Path to the file to write
   * @param content Content to write to the file
   */
  @Put()
  @Consumes(textPlainMIME)
  public async writeFile(
    @Query() env: Environment = defaultEnvironment,
    @Query() path: string,
    @Body() content: string,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ) {
    const sessionID = getUserSessionID(conversationID, env)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: env })
    
    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}