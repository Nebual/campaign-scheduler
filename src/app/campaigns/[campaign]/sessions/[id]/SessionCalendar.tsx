import React, { useMemo } from 'react'

import { Box } from '@mui/material'

import type { User } from '@/types'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayJsPlugin from 'fullcalendar-plugin-dayjs'
import timeGridPlugin from '@fullcalendar/timegrid'
import useSWR from 'swr'
import distinctColors from 'distinct-colors'

import './Calendar.scss'
import dayjs from 'dayjs'

type SessionCalendarProps = {
	people: Pick<User, 'id'>[]
	sessionId?: string
	sessionDate?: string
	setSessionDate?: (date: string) => void
}

async function fetchAll([_, peopleIds]: [string, string[]]) {
	return Promise.all(
		peopleIds.map((userId: string) =>
			fetch(`/api/users/${userId}/cal`).then((res) => res.json())
		)
	)
}

export default function SessionCalendar({
	people,
	sessionId,
	sessionDate,
	setSessionDate,
}: SessionCalendarProps) {
	const peopleIds = people.map(({ id }) => id)
	const { data } = useSWR(['/api/users/[id]/cal', peopleIds], fetchAll)

	const colours = useMemo(
		() => distinctColors({ count: data?.length || 0 }),
		[data?.length]
	)
	let events = data?.flatMap((d, i: number) => {
		const backgroundColor = colours[i]
		return (
			d.events?.map((e: any) => ({
				...e,
				backgroundColor,
				classNames: e.sessionId ? ['sessionEvent'] : [],
				textColor:
					backgroundColor.luminance() > 0.5 ? 'black' : 'white',
				url: e.sessionId
					? `/campaigns/${e.campaignId}/sessions/${e.sessionId}`
					: '',
			})) || []
		)
	})
	if (sessionDate && events) {
		events = events.filter((e: any) => e.sessionId !== sessionId)
		events.push({
			title: 'This Session',
			start: sessionDate,
			end: dayjs(sessionDate).add(3, 'hour').toISOString(),
			backgroundColor: 'rgba(0, 100, 0, 0.3)',
		})
	}
	return (
		<Box>
			<FullCalendar
				plugins={[dayJsPlugin, timeGridPlugin, interactionPlugin]}
				initialView="timeGridWeek"
				events={events}
				dateClick={(info) => {
					if (!setSessionDate) {
						return
					}
					setSessionDate(info.dateStr)
				}}
				height="calc(min(800px, 100vh - 92px))"
			/>
		</Box>
	)
}
