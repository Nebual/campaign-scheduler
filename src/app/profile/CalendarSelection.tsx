import React, { useEffect, useState } from 'react'

import useSWR from 'swr'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayJsPlugin from 'fullcalendar-plugin-dayjs'
import { useLocalStorage } from '@rehooks/local-storage'
import {
	Box,
	Checkbox,
	FormControlLabel,
	Switch,
	Tooltip,
	Typography,
} from '@mui/material'

import { LoginToken } from '@/types'
import { useEffectAfterInit } from '@/hooks'
import { busyResponseToEvents } from '@/calendarUtil'

export default function CalendarSelection() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')
	const [enabledCalendars, setEnabledCalendars] = useState<string[]>([])
	const [invertedCalendars, setInvertedCalendars] = useState<string[]>([])
	const [needsSave, setNeedsSave] = useState(false)

	const { data } = useSWR('myCalendars', async () =>
		fetch(`/api/users/${loginToken?.id}/calSetup`, {
			headers: {
				Authorization: `Bearer ${loginToken?.idToken}`,
			},
		}).then((res) => res.json())
	)
	const calendars = data?.calendars
	const freeBusyCalendars = data?.freeBusyCalendars
	useEffect(() => {
		if (data) {
			const newEnabledCalendars = data.enabledCalendars || []
			if (!newEnabledCalendars.length && data.calendars?.length) {
				setEnabledCalendars(
					data.calendars
						.filter(
							(item: any) =>
								// default off these, they're unlikely to be useful
								!item.id.includes('@group.calendar.google.com')
						)
						.map((item: any) => item.id)
				)
			}
			setEnabledCalendars(newEnabledCalendars)
			setInvertedCalendars(data.invertedCalendars || [])
		}
	}, [data])

	useEffectAfterInit(() => {
		if (!needsSave) {
			return
		}

		setNeedsSave(false)
		void fetch('/api/users', {
			method: 'PUT',
			body: JSON.stringify({
				email: loginToken?.email,
				enabledCalendars,
				invertedCalendars,
			}),
		})
	}, [needsSave, enabledCalendars, invertedCalendars, loginToken])

	const calendarsById = calendars?.reduce(
		(acc: any, item: any) => ({ ...acc, [item.id]: item }),
		{}
	)
	const events = busyResponseToEvents({
		freeBusyCalendars,
		enabledCalendars,
		invertedCalendars,
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
			<Box
				sx={{
					width: 'fit-content',
				}}
			>
				{calendars?.map((item: any) => (
					<Box
						key={`checkbox-${item.id}`}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={enabledCalendars.includes(item.id)}
									onChange={(e) => {
										setEnabledCalendars(
											e.target.checked
												? [...enabledCalendars, item.id]
												: enabledCalendars.filter(
														(x) => x !== item.id
												  )
										)
										setNeedsSave(true)
									}}
								/>
							}
							label={item.summary}
						/>
						<Tooltip title="On = Calendar Events list periods of Availability">
							<FormControlLabel
								control={
									<Switch
										checked={invertedCalendars.includes(
											item.id
										)}
										onChange={(e) => {
											setInvertedCalendars(
												e.target.checked
													? [
															...invertedCalendars,
															item.id,
													  ]
													: invertedCalendars.filter(
															(x) => x !== item.id
													  )
											)
											setNeedsSave(true)
										}}
									/>
								}
								label="Whitelist"
							/>
						</Tooltip>
					</Box>
				))}
			</Box>

			<FullCalendar
				plugins={[dayJsPlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				events={events}
			/>
		</Box>
	)
}
