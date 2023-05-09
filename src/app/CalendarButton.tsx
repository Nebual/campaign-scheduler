'use client'
import React, { useEffect, useState } from 'react'

import { useLocalStorage } from '@rehooks/local-storage'
import {
	Autocomplete,
	Box,
	Button,
	SwipeableDrawer,
	TextField,
} from '@mui/material'
import { LoginToken } from '@/types'
import SessionCalendar from '@/app/campaigns/[campaign]/sessions/[id]/SessionCalendar'
import { useKnownUsers } from '@/hooks'
import { PeopleFilterOption } from '@/app/CampaignTable'
import dynamic from 'next/dynamic'

function CalendarButton() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')

	const [calendarOpen, setCalendarOpen] = useState(
		() => location.hash === '#calendar'
	)
	const [hasOpened, setHasOpened] = useState(calendarOpen)

	React.useEffect(() => {
		location.hash = calendarOpen
			? '#calendar'
			: location.hash !== '#calendar'
			? location.hash
			: ''
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

// SSR seems to hate this (errors on build for location), so lets disable SSR
export default dynamic(async () => CalendarButton, {
	ssr: false,
})

function CalendarDrawerContents() {
	const knownUsers = useKnownUsers()
	const [filterPeople, setFilterPeople] = useState<PeopleFilterOption[]>([])
	useEffect(() => {
		if (!knownUsers?.length) {
			return
		}
		setFilterPeople((filterPeople) =>
			filterPeople.length ? filterPeople : knownUsers
		)
	}, [knownUsers])

	return (
		<Box sx={{ p: 2 }}>
			<Autocomplete
				sx={{
					mx: 2,
					minWidth: 300,
					maxWidth: 600,
					'& .MuiInputBase-root': {
						minHeight: '4.5ch',
						flexWrap: 'nowrap',
						overflowX: 'hidden',
					},
				}}
				value={filterPeople}
				onChange={(event: any, newValues: PeopleFilterOption[]) => {
					setFilterPeople(newValues)
				}}
				options={knownUsers || []}
				getOptionLabel={(option: PeopleFilterOption) => option.id}
				multiple
				disableCloseOnSelect
				clearOnEscape
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder="   filter by people"
						variant="standard"
					/>
				)}
			/>
			<SessionCalendar people={filterPeople || []} />
		</Box>
	)
}
