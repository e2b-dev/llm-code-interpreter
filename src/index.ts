import express, {
  json,
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express'
import { ValidateError } from 'tsoa'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { readFileSync } from 'fs'

import { RegisterRoutes } from './generated/routes'
import { defaultPort } from './constants'

export const app = express()

app.use(
  cors(),
  urlencoded({
    extended: true,
  }),
  morgan('tiny'),
  json(),
)

function loadStaticFile(relativePath: string) {
  return readFileSync(path.join(__dirname, relativePath), 'utf-8')
}

const pluginManifest = loadStaticFile('../.well-known/ai-plugin.json')
const pluginAPISpec = loadStaticFile('../openapi.yaml')

app.get(
  '/.well-known/ai-plugin.json',
  (_, res) => {
    res
      .setHeader('Content-Type', 'text/json')
      .status(200)
      .send(pluginManifest)
  }
)

app.get(
  '/openapi.yaml',
  (_, res) => {
    res
      .setHeader('Content-Type', 'text/yaml')
      .status(200)
      .send(pluginAPISpec)
  }
)

RegisterRoutes(app)

app.use(
  function notFoundHandler(_req, res: ExResponse) {
    res.status(500).send({
      message: 'Not Found',
    })
  },
  function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      })
    }
    if (err instanceof Error) {
      console.warn(`Caught Internal Error for ${req.path}:`, err)
      return res.status(500).json({
        message: 'Internal Server Error',
      })
    }
    next()
  },
)

const port = process.env.PORT || defaultPort

app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}`)
)
