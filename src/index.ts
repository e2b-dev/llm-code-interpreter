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

import pluginManifest from '!!raw-loader!../../.well-known/ai-plugin.json'
import pluginAPISpec from '!!raw-loader!../pluginapi.yaml'

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

app.use(
  '.well-known/ai-plugin.json',
  (_, res) => {
    res
      .setHeader('Content-Type', 'text/json')
      .status(200)
      .send(pluginManifest)
  }
)

app.use(
  'openapi.yaml',
  (_, res) => {
    res
      .setHeader('Content-Type', 'text/yaml')
      .status(200)
      .send(pluginAPISpec)
  }
)

const port = process.env.PORT || defaultPort

app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}`)
)
