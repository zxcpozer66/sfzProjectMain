import type { UserData } from "../interfaces/types"

export const formatDate = (date: Date | undefined): string => {
	if (!date) return "—"

	return new Intl.DateTimeFormat("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date)
}

export const calculateTimeDifference = (
	startTime: Date | string | undefined | null,
	endTime: Date | string | undefined | null
): { hours?: number; minutes?: number } => {
	const start =
		typeof startTime === "string" ? new Date(startTime) : startTime
	const end = typeof endTime === "string" ? new Date(endTime) : endTime

	if (!start || !end || !(start instanceof Date) || !(end instanceof Date))
		return {}

	const diffMs = end.getTime() - start.getTime()
	const hours = Math.floor(diffMs / (1000 * 60 * 60))
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
	return { hours, minutes }
}

export const formatTimeDifference = (diff: {
	hours?: number
	minutes?: number
}): string => {
	const { hours = 0, minutes = 0 } = diff

	return `${hours} ч ${minutes} мин`
}

export function transformUserData(users: any[]): UserData[] {
	return users.map((user) => ({
		id: user.id,
		username: user.username || "н/д",
		name: user.name || "н/д",
		surname: user.surname || "н/д",
		patronymic: user.patronymic || "н/д",
		department: user.department?.title || "н/д",
		department_id: user.department?.id || 0,
		total_work_hours: parseInt(user.total_work_hours) || 0,
		available_hours: parseInt(user.available_hours) || 0,
		role_id: user.role_id || "н/д",
		role: user.role?.title || "н/д"
	}))
}


export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) return -1
	if (b[orderBy] > a[orderBy]) return 1
	return 0
}

export type Order = "asc" | "desc"
export function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: Record<Key, any>, b: Record<Key, any>) => number {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy)
}


export function formatHours(hours: number): string {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${hours} часов`;
  }

  switch (lastDigit) {
    case 1:
      return `${hours} час`;
    case 2:
    case 3:
    case 4:
      return `${hours} часа`;
    default:
      return `${hours} часов`;
  }
}