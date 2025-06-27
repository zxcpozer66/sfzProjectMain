import type { RequestData } from '../interfaces/api/requestData'
import type { Detail } from '../interfaces/componentTypes/details'

export type DetailKeys = keyof Detail

export const labelMap: Record<keyof Detail, string> = {
  startTime: 'Начало',
  endTime: 'Конец',
  descriptionProblem: 'Описание проблемы или задачи пользователем',
  descriptionTask: 'Описание задачи специалистом',
  answer: 'Решение задачи специалистом',
  notation: 'Примечание',
  order_application: 'Поручение',
  typeReaction: 'Тип реакции',
  setStartTime: 'Установить время начала', 
  setEndTime: 'Установить время окончания', 
  typeReactionId: 'ID типа реакции', 
  notationId: 'ID примечания' 
}

export const mapDetailToRequest: Record<keyof Detail, keyof RequestData> = {
  startTime: 'start_time',
  endTime: 'end_time',
  descriptionProblem: 'description_problem',
  descriptionTask: 'description_task',
  answer: 'answer',
  notation: 'notation_id',
  typeReaction: 'type_reaction_id',
  order_application: 'order_application',
  setStartTime: 'set_start_time', 
  setEndTime: 'set_end_time',
  typeReactionId: 'type_reaction_id', 
  notationId: 'notation_id' 
}

export const detailFields: DetailKeys[] = [
	'startTime',
	'endTime',
	'descriptionProblem',
	'descriptionTask',
	'answer',
	'notation',
	'order_application',
	'typeReaction',
]
