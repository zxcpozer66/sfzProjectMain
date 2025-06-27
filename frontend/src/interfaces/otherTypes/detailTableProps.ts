import type { Notation } from '../modelsTypes/notation'
import type { Reaction } from '../modelsTypes/reaction'

export interface DetailTableProps {
	reactionOptions: Reaction[]
	notationOptions: Notation[]
}
