import React, { useEffect, useMemo } from 'react'

import dayjs from 'dayjs'
import useSWR from 'swr'
import distinctColors from 'distinct-colors'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayJsPlugin from 'fullcalendar-plugin-dayjs'
import { useLocalStorage } from '@rehooks/local-storage'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

import { LoginToken } from '@/types'
import LoginButton, { tokenIsValid } from '@/app/LoginButton'
import { useEffectAfterInit } from '@/hooks'

export default function CalendarSelection() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')
	const [enabledCalendars, setEnabledCalendars] = useLocalStorage<string[]>(
		'enabledCalendars',
		[]
	)
	const validToken = tokenIsValid(loginToken)

	const { data: calendars } = useSWR(
		validToken ? 'myCalendars' : null,
		async () =>
			await fetch(
				'https://www.googleapis.com/calendar/v3/users/me/calendarList',
				{
					headers: {
						Authorization: `Bearer ${loginToken?.idToken}`,
					},
				}
			)
				.then((res) => res.json())
				.then((response) =>
					response.items
						.filter(
							(item: any) =>
								!item.id.includes('#holiday') &&
								!item.id.includes('#contacts') &&
								!item.id.includes('@import.calendar.google.com')
						)
						.sort(
							(a: any, b: any) =>
								(b.selected ? 1 : 0) - (a.selected ? 1 : 0) ||
								a.summary.localeCompare(b.summary)
						)
				)
	)

	const emptyEnabledCalendars = !enabledCalendars.length
	useEffect(() => {
		if (calendars && emptyEnabledCalendars) {
			setEnabledCalendars(
				calendars
					.filter(
						(item: any) =>
							// default off these, they're unlikely to be useful
							!item.id.includes('@group.calendar.google.com')
					)
					.map((item: any) => item.id)
			)
		}
	}, [calendars, emptyEnabledCalendars, setEnabledCalendars])

	useEffectAfterInit(() => {
		void (async () => {
			await fetch('/api/users', {
				method: 'PUT',
				body: JSON.stringify({
					email: loginToken?.email,
					enabledCalendars,
				}),
			})
		})()
	}, [enabledCalendars])

	const { data: freeBusyResponse } = useSWR(
		calendars && validToken ? 'myFreeBusy' : null, // disable while loading calendars
		async () =>
			await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${loginToken?.idToken}`,
				},
				body: JSON.stringify({
					timeMin: new Date().toISOString(),
					timeMax: dayjs().add(1, 'month').toISOString(),
					items: calendars.map((item: any) => ({ id: item.id })),
				}),
			}).then((res) => res.json())
	)
	const colours = useMemo(
		() => distinctColors({ count: calendars?.length || 0 }),
		[calendars?.length]
	)

	return (
		<Box sx={{ mt: 2 }}>
			<Typography variant="h4">Calendar Selection</Typography>
			{!validToken ? (
				<>
					<Typography
						variant="caption"
						color="error"
						sx={{ display: 'block', mt: 2 }}
					>
						Auth timed out, please log in again to configure
						calendars
					</Typography>
					<LoginButton />
				</>
			) : (
				<>
					<Typography variant="subtitle1">
						Enable the Calendars which indicate when you are busy:
					</Typography>
					<Typography variant="caption">
						You may wish to add a new Calendar for your bedtime/etc,
						which you can then personally hide in Google Calendar
						itself.
					</Typography>
					{calendars?.map((item: any) => (
						<FormControlLabel
							key={`checkbox-${item.id}`}
							control={
								<Checkbox
									checked={enabledCalendars.includes(item.id)}
									onChange={(e) =>
										setEnabledCalendars(
											e.target.checked
												? [...enabledCalendars, item.id]
												: enabledCalendars.filter(
														(x) => x !== item.id
												  )
										)
									}
								/>
							}
							label={item.summary}
						/>
					))}

					<FullCalendar
						plugins={[dayJsPlugin, timeGridPlugin]}
						initialView="timeGridWeek"
						events={Object.keys(freeBusyResponse?.calendars || {})
							.filter((key) => enabledCalendars.includes(key))
							.flatMap((key, i) => {
								const cal = calendars.find(
									({ id }: { id: string }) => id === key
								)
								return freeBusyResponse.calendars[key].busy.map(
									(busy: any) => ({
										title: cal?.summary || key,
										start: busy.start,
										end: busy.end,
										textColor: 'black',
										backgroundColor:
											cal?.backgroundColor ||
											colours[i].hex(),
									})
								)
							})}
					/>
				</>
			)}
		</Box>
	)
}
