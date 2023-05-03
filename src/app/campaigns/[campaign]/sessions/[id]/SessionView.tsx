'use client'

import { useState, useEffect } from 'react'

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Container,
	TextField,
	Typography,
} from '@mui/material'

import type { Session } from '@/types'
import DateTimePicker from '@/DateTimePicker'
import { dateStringFormat } from '@/util'
import UserChip from '@/UserChip'
import SessionCalendar from '@/app/campaigns/[campaign]/sessions/[id]/SessionCalendar'

type SessionViewProps = {
	session: Session
}

export default function SessionView({
	session: sessionOriginal,
}: SessionViewProps) {
	const [savedSession, setSavedSession] = useState(sessionOriginal)
	const [session, setSession] = useState(sessionOriginal)

	// auto save any changes
	useEffect(() => {
		if (JSON.stringify(session) === JSON.stringify(savedSession)) {
			return
		}

		void (async () => {
			await fetch(
				`/campaigns/${session.campaign}/sessions/${session.id}/api`,
				{
					method: 'PUT',
					body: JSON.stringify(session),
				}
			)
			setSavedSession(session)
		})()
	}, [session, savedSession])

	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					my: 4,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						width: '100%',
					}}
				>
					<Breadcrumbs>
						<Button href="/">Main</Button>
						<Button href={`/campaigns/${session.campaign}`}>
							{session.campaign}
						</Button>
						<Typography>
							{dateStringFormat(session.date)}
						</Typography>
					</Breadcrumbs>
					<Box sx={{ mx: 'auto' }}>
						<Typography variant="h4" component="h1" gutterBottom>
							{session.campaign} -{' '}
							<DateTimePicker
								value={session.date}
								setValue={(val) =>
									setSession((session) => ({
										...session,
										date: val,
									}))
								}
							/>
						</Typography>
					</Box>
				</Box>
				<Card sx={{ my: 4 }}>
					<CardContent>
						<Typography variant="h6" component="h2">
							People
						</Typography>
						<div>
							{session.people.map((user) => (
								<UserChip
									key={`session.${user.id}`}
									user={user}
									sx={{ mr: 1, mt: 1 }}
									onDelete={() => {
										setSession((session) => ({
											...session,
											people: session.people.filter(
												(p) =>
													p.id.toLowerCase() !==
													user.id.toLowerCase()
											),
										}))
									}}
								/>
							))}
						</div>
						<TextField
							label="Add Person"
							variant="standard"
							sx={{ mt: 2 }}
							onKeyDown={(e) => {
								const id = (e.target as HTMLInputElement).value
								if (e.key === 'Enter') {
									if (
										!session.people.some(
											(user) =>
												user.id.toLowerCase() ===
												id.toLowerCase()
										)
									) {
										setSession((session) => ({
											...session,
											people: [...session.people, { id }],
										}))
									}
									;(e.target as HTMLInputElement).value = ''
								}
							}}
						/>
					</CardContent>
				</Card>
				<SessionCalendar people={session.people} />
			</Box>
		</Container>
	)
}
