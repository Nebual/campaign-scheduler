import dayjs from 'dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD hh:mm A'
export function dateStringFormat(date: string) {
	return dayjs(date).format(DATE_FORMAT)
}
