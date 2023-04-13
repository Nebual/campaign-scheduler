'use client'

import { useState, useEffect } from 'react'

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	TextField,
	Typography,
} from '@mui/material'

import type { Session } from '@/campaignDb'
import DateTimePicker from '@/DateTimePicker'
import { dateStringFormat } from '@/util'

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
							{session.people.map((person) => (
								<Chip
									key={`session.${person}`}
									label={person}
									variant="outlined"
									sx={{ mr: 1, mt: 1 }}
									onDelete={() => {
										setSession((session) => ({
											...session,
											people: session.people.filter(
												(p) => p !== person
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
								if (e.key === 'Enter') {
									setSession((session) => ({
										...session,
										people: [
											...session.people,
											(e.target as HTMLInputElement)
												.value,
										],
									}))
									;(e.target as HTMLInputElement).value = ''
								}
							}}
						/>
					</CardContent>
				</Card>
			</Box>
		</Container>
	)
}
