import dayjs from 'dayjs'

export function busyResponseToEvents({
	freeBusyCalendars,
	enabledCalendars,
	name,
	formatFn,
}: {
	freeBusyCalendars: any
	enabledCalendars: string[]
	name?: string
	formatFn?: (busy: any, key: string) => any
}) {
	return Object.keys(freeBusyCalendars || {})
		.filter((key) => enabledCalendars.includes(key))
		.flatMap((key, i) => {
			let previousEvent: any = null
			return freeBusyCalendars[key].busy
				.map((calEvent: any) => {
					if (
						previousEvent &&
						// combine events if they are less than 1 hour apart, thats not enough time to play anything
						dayjs(calEvent.start).diff(
							previousEvent.end,
							'minute'
						) <= 70
					) {
						previousEvent.end = calEvent.end
						return null
					}
					previousEvent = {
						title: name,
						start: calEvent.start,
						end: calEvent.end,
						textColor: 'black',
						...(formatFn ? formatFn(calEvent, key) : {}),
					}
					return previousEvent
				})
				.filter(Boolean)
		})
}
