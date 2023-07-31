import {
  Controller,
  Get,
  Put,
  Header,
  Query,
  Route,
  BodyProp,
  TsoaResponse,
  Res,
  Produces,
} from 'tsoa'
import { dirname } from 'path'

import { CachedSession } from '../sessions/session'
import { openAIConversationIDHeader, textPlainMIME } from '../constants'
import { Environment, defaultEnvironment, getUserSessionID } from './environment'

@Route('files')
export class FileController extends Controller {
  /**
   * @summary Read the contents of a file at the given path
   * 
   * @param env Environment where to read the file from
   * @param path Path to the file to read
   * @param notFoundResponse Response to send if the file is not found
   * @returns Contents of the file as a string
   */
  @Get()
  @Produces(textPlainMIME)
  public async readFile(
    @Query() env: Environment = defaultEnvironment,
    @Query() path: string,
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ): Promise<string> {
    const sessionID = getUserSessionID(conversationID, env)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: env })

    // Even though we're returning a string and using @Produces, we need to set the content type manually.
    this.setHeader('Content-Type', textPlainMIME)

    try {
      return await session
        .session
        .filesystem!
        .read(path)
    } catch (err) {
      console.error(err)
      return notFoundResponse(404, { 
        reason: `File on path "${path}" not found`,
      })
    }
  }

  /**
   * @summary Write content to a file at the given path
   * 
   * @param env Environment where to write the file
   * @param path Path to the file to write
   * @param content Content to write to the file
   */
  @Put()
  public async writeFile(
    @Query() env: Environment = defaultEnvironment,
    @Query() path: string,
    @BodyProp() content: string,
    @Header(openAIConversationIDHeader) conversationID?: string,
  ) {
    const sessionID = getUserSessionID(conversationID, env)
    const session = await CachedSession.findOrStartSession({ sessionID, envID: env })
    
    const dir = dirname(path)
    await session.session.filesystem!.makeDir(dir)
    await session.session.filesystem!.write(path, content)
  }
}