'use client'

import React, { useMemo } from 'react'

import { Box } from '@mui/material'

import type { User } from '@/types'
import FullCalendar from '@fullcalendar/react'
import dayJsPlugin from 'fullcalendar-plugin-dayjs'
import timeGridPlugin from '@fullcalendar/timegrid'
import useSWR from 'swr'
import distinctColors from 'distinct-colors'

import './Calendar.scss'

type SessionCalendarProps = {
	people: User[]
}

async function fetchAll([_, peopleIds]: [string, string[]]) {
	return Promise.all(
		peopleIds.map((userId: string) => {
			console.log('got', userId)
			return fetch(`/api/users/${userId}/cal`).then((res) => res.json())
		})
	)
}

export default function SessionCalendar({ people }: SessionCalendarProps) {
	const peopleIds = people.map(({ id }) => id)
	const { data } = useSWR(['/api/users/[id]/cal', peopleIds], fetchAll)

	const colours = useMemo(
		() => distinctColors({ count: data?.length || 0 }),
		[data?.length]
	)
	return (
		<Box>
			<FullCalendar
				plugins={[dayJsPlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				events={data?.flatMap((d, i: number) => {
					const backgroundColor = colours[i]
					return (
						d.events?.map((e: any) => ({
							...e,
							backgroundColor,
							textColor:
								backgroundColor.luminance() > 0.5
									? 'black'
									: 'white',
						})) || []
					)
				})}
			/>
		</Box>
	)
}
