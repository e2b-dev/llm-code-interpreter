import {
  components as devbookAPIComponents,
} from '@devbookhq/sdk'

export type Template = devbookAPIComponents['schemas']['Template']

export const defaultTemplate: Template = 'Nodejs'

export function getUserSessionID(conversationID: string, template: Template) {
  return `${conversationID}-${template}`
}
