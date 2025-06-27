import type { Notation } from '../modelsTypes/notation'
import type { Reaction } from '../modelsTypes/reaction'

export interface EditableCellProps {
	keyName: string
	value: any
	editMode: boolean
	onChange: (value: any) => void
	reactionOptions: Reaction[]
	notationOptions: Notation[]
}
