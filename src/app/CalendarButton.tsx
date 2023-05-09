'use client'
import React, { useState } from 'react'

import { useLocalStorage } from '@rehooks/local-storage'
import { Button, SwipeableDrawer } from '@mui/material'
import { LoginToken } from '@/types'
import SessionCalendar from '@/app/campaigns/[campaign]/sessions/[id]/SessionCalendar'
import { useKnownUsers } from '@/hooks'

export default function CalendarButton() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')

	const [calendarOpen, setCalendarOpen] = useState(false)
	const [hasOpened, setHasOpened] = useState(calendarOpen)

	React.useEffect(() => {
		if (!calendarOpen) {
			return
		}
		setHasOpened(true)
	}, [calendarOpen])

	if (!loginToken?.id) {
		return null
	}
	return (
		<>
			<Button
				href="#calendar"
				onClick={() => setCalendarOpen((state) => !state)}
				sx={{
					color: '#fff',
				}}
			>
				Calendar
			</Button>
			<SwipeableDrawer
				keepMounted
				anchor="bottom"
				open={calendarOpen}
				onClose={() => setCalendarOpen(false)}
				onOpen={() => setCalendarOpen(true)}
			>
				{hasOpened && <CalendarDrawerContents />}
			</SwipeableDrawer>
		</>
	)
}

function CalendarDrawerContents() {
	const knownUsers = useKnownUsers()
	return <SessionCalendar people={knownUsers || []} />
}
