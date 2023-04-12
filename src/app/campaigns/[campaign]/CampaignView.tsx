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
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'

import EditableComponent from './EditableComponent'
import type { Campaign, Session } from './util'

type CampaignViewProps = {
	campaign: Campaign
}

export default function CampaignView({
	campaign: campaignOriginal,
}: CampaignViewProps) {
	const [campaign, setCampaign] = useState(campaignOriginal)
	const [hasSaved, setHasSaved] = useState(false)

	// auto save any changes
	useEffect(() => {
		if (JSON.stringify(campaign) === JSON.stringify(campaignOriginal)) {
			return
		}

		void (async () => {
			setHasSaved(true)
			await fetch(`/campaigns/${campaignOriginal.name}/api`, {
				method: 'PUT',
				body: JSON.stringify(campaign),
			})
			campaignOriginal.name = campaign.name
		})()
	}, [campaign, campaignOriginal])

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
						{/** @ts-ignore prefetch prop, a workaround to bust the cache after saving */}
						<Button href="/" prefetch={!hasSaved}>
							Main
						</Button>
						<Typography>{campaign.name}</Typography>
					</Breadcrumbs>
					<Box sx={{ mx: 'auto' }}>
						<EditableComponent
							value={campaign.name}
							setValue={(val) =>
								setCampaign((campaign) => ({
									...campaign,
									name: val,
								}))
							}
							normalComponent={
								<Typography
									variant="h4"
									component="h1"
									gutterBottom
								>
									{campaign.name}
								</Typography>
							}
						/>
					</Box>
					<Button href={`/campaigns/${campaign.name}/sessions/new`}>
						Schedule Session
					</Button>
				</Box>
				<Card sx={{ my: 4 }}>
					<CardContent>
						<Typography variant="h6" component="h2">
							People
						</Typography>
						<div>
							{campaign.people.map((person) => (
								<Chip
									key={`${campaign.name}.${person}`}
									label={person}
									variant="outlined"
									sx={{ mr: 1, mt: 1 }}
									onDelete={() => {
										setCampaign((campaign) => ({
											...campaign,
											people: campaign.people.filter(
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
									setCampaign((campaign) => ({
										...campaign,
										people: [
											...campaign.people,
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
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>People</TableCell>
								<TableCell>{/*Actions*/}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{campaign.sessions.map((session) => (
								<SessionRow
									key={session.date}
									session={session}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}

type SessionRowProps = {
	session: Session
}

function SessionRow({ session }: SessionRowProps) {
	return (
		<TableRow
			sx={{
				'&:last-child td, &:last-child th': {
					border: 0,
				},
			}}
		>
			<TableCell component="th" scope="row">
				{session.date}
			</TableCell>
			<TableCell>
				{session.people.map((person) => (
					<Chip
						key={`${session.date}.${person}`}
						label={person}
						variant="outlined"
					/>
				))}
			</TableCell>
			<TableCell align="right">
				<Link
					href={`/campaigns/${session.campaign}/sessions/${session.date}`}
				>
					Edit
				</Link>
			</TableCell>
		</TableRow>
	)
}
