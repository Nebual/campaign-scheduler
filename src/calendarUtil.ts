import dayjs from 'dayjs'

export function busyResponseToEvents({
	freeBusyCalendars,
	enabledCalendars,
	invertedCalendars,
	name,
	formatFn,
	combineAcrossCalendars = false,
}: {
	freeBusyCalendars: any
	enabledCalendars: string[]
	invertedCalendars: string[]
	name?: string
	formatFn?: (busy: any, key: string) => any
	combineAcrossCalendars?: boolean
}) {
	const result = Object.keys(freeBusyCalendars || {})
		.filter((key) => enabledCalendars.includes(key))
		.flatMap((key, i) => {
			let previousEvent: any = null
			const formattedEvents = freeBusyCalendars[key].busy
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
						...(formatFn ? formatFn(calEvent, key) : {}),
					}
					return previousEvent
				})
				.filter(Boolean)

			if (invertedCalendars.includes(key)) {
				const invertedEvents = []
				let start = dayjs().startOf('day')
				formattedEvents.forEach((event: any) => {
					if (start.isBefore(event.start)) {
						invertedEvents.push({
							...event,
							start: start.toISOString(),
							end: event.start,
						})
					}
					start = dayjs(event.end)
				})

				invertedEvents.push({
					...(formattedEvents.length > 0
						? formattedEvents[0]
						: {
								title: name,
								...(formatFn ? formatFn({}, key) : {}),
						  }),
					start: start.toISOString(),
					end: dayjs().startOf('day').add(1, 'month').toISOString(),
				})
				return invertedEvents
			}

			return formattedEvents
		})
	if (combineAcrossCalendars) {
		let previousEvent: any = null
		return result
			.sort((a: any, b: any) =>
				b.start === a.start
					? 0
					: dayjs(b.start).isBefore(a.start)
					? 1
					: -1
			)
			.map((event: any) => {
				if (
					previousEvent &&
					dayjs(event.start).isBefore(previousEvent.end)
				) {
					if (previousEvent.end < event.end) {
						previousEvent.end = event.end
					}
					return null
				}
				previousEvent = event
				return event
			})
			.filter(Boolean)
	}
	return result
}
