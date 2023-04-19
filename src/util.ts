import dayjs from 'dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD hh:mm A'
export function dateStringFormat(date: string) {
	return dayjs(date).format(DATE_FORMAT)
}

export function parseJwt(token: string) {
	const base64Url = token.split('.')[1]
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)

	return JSON.parse(jsonPayload)
}
