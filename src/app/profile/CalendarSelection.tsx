import React, { useEffect } from 'react'

import useSWR from 'swr'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayJsPlugin from 'fullcalendar-plugin-dayjs'
import { useLocalStorage } from '@rehooks/local-storage'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

import { LoginToken } from '@/types'
import { useEffectAfterInit } from '@/hooks'
import { busyResponseToEvents } from '@/calendarUtil'

export default function CalendarSelection() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')
	const [enabledCalendars, setEnabledCalendars] = useLocalStorage<string[]>(
		'enabledCalendars',
		[]
	)

	const { data } = useSWR('myCalendars', async () =>
		fetch(`/api/users/${loginToken?.id}/calSetup`, {
			headers: {
				Authorization: `Bearer ${loginToken?.idToken}`,
			},
		}).then((res) => res.json())
	)
	const calendars = data?.calendars
	const freeBusyCalendars = data?.freeBusyCalendars

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

	const calendarsById = calendars?.reduce(
		(acc: any, item: any) => ({ ...acc, [item.id]: item }),
		{}
	)
	const events = busyResponseToEvents({
		freeBusyCalendars,
		enabledCalendars,
		formatFn: (entry, key) => ({
			backgroundColor: calendarsById[key]?.backgroundColor,
			title: calendarsById[key]?.summary || key,
		}),
	})

	return (
		<Box sx={{ mt: 2 }}>
			<Typography variant="h4">Calendar Selection</Typography>
			<Typography variant="subtitle1">
				Enable the Calendars which indicate when you are busy:
			</Typography>
			<Typography variant="caption">
				You may wish to add a new Calendar for your bedtime/etc, which
				you can then personally hide in Google Calendar itself.
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
				events={events}
			/>
		</Box>
	)
}
