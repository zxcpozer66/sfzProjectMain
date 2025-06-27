import type { Notation } from '../modelsTypes/notation'

export interface Detail {
  descriptionProblem?: string
  descriptionTask?: string
  answer?: string
  notation?: Notation | string
  order_application?: string
  startTime?: string
  endTime?: string
  typeReaction?: string
  setStartTime?: boolean 
  setEndTime?: boolean 
  typeReactionId?: number 
  notationId?: number 
}
