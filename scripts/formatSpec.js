#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

const yaml = require('js-yaml')
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development'

const spec = yaml.load(fs.readFileSync('openapi.yaml', 'utf8'))

// TODO: Delete empty components, securitySchema, secuirity, and openai hidden headers
// TODO: Delete old and write correct info
// TODO: Delete local dev server url for production

function isObjEmpty (obj) {
  return Object.keys(obj).length === 0;
}

const components = spec['components']

if (components) {
  Object.keys(components).forEach((key) => {
    // Delete empty component schemas
    if (isObjEmpty(components[key])) {
      delete components[key]
    }
  })

  // Delete components if empty
  if (isObjEmpty(components)) {
    delete spec['components']
  }
}

const paths = spec['paths']

if (paths) {
  Object.keys(paths).forEach((key) => {
    // Delete empty paths
    if (isObjEmpty(paths[key])) {
      delete paths[key]
    }


    Object.keys(paths[key]).forEach((method) => {
      // Delete empty methods
      if (isObjEmpty(paths[key][method])) {
        delete paths[key][method]
      }

      // Delete security if empty
      if (paths[key][method]['security']) {
        if (paths[key][method]['security'].length === 0) {
          delete paths[key][method]['security']
        }
      }

      // Delete openai-conversation-id header if exists - this should not be in spec for the plugin, it is automatically added by openai
      if (paths[key][method]['parameters']) {
        const conversationIDParameterIdx = paths[key][method]['parameters'].findIndex((parameter) => parameter.name === 'openai-conversation-id' && parameter.in === 'header')
        if (conversationIDParameterIdx !== -1) {
          paths[key][method]['parameters'].splice(conversationIDParameterIdx, 1)
        }
      }
    })
  })
}

const info = spec['info']
if (info) {
  // Delete old info - it is generated from package.json with excessive fields
  delete spec['info']
}

// Add new info
spec['info'] = {
  title: 'TODO Plugin',
  description: 'A plugin that allows the user to create and manage a TODO list using ChatGPT.',
  version: 'v1',
}

fs.writeFileSync('openapi.yaml', yaml.dump(spec, { sortKeys: true, indent: 2, condenseFlow: true, noArrayIndent: true, noCompatMode: true, lineWidth: -1 }))
