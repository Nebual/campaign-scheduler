'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
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
import type { Campaign, Session } from '@/types'
import { useRefreshOnSoftNav } from '@/hooks'
import { dateStringFormat } from '@/util'
import UserChip from '@/UserChip'
import { useLocalStorage } from '@rehooks/local-storage'
import { LoginToken } from '@/types'

type CampaignViewProps = {
	campaign: Campaign
}

export default function CampaignView({
	campaign: campaignOriginal,
}: CampaignViewProps) {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')
	const router = useRouter()
	const [campaignSaved, setCampaignSaved] = useState(() => ({
		...campaignOriginal,
		people:
			campaignOriginal.people.length === 0 && loginToken?.id
				? [{ id: loginToken?.id }]
				: campaignOriginal.people,
	}))
	const [campaign, setCampaign] = useState(campaignSaved)
	useRefreshOnSoftNav(`/campaigns/${campaign.name}`)

	// auto save any changes
	useEffect(() => {
		if (JSON.stringify(campaign) === JSON.stringify(campaignSaved)) {
			return
		}

		void (async () => {
			await fetch(`/campaigns/${campaignSaved.name}/api`, {
				method: 'PUT',
				body: JSON.stringify(campaign),
			})
			if (campaignSaved.name !== campaign.name) {
				router.replace(`/campaigns/${campaign.name}`)
			}
			setCampaignSaved(campaign)
		})()
	}, [campaign, campaignSaved, router])

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
							{campaign.people.map((user) => (
								<UserChip
									key={`${campaign.name}.${user.id}`}
									user={user}
									sx={{ mr: 1, mt: 1 }}
									onDelete={() => {
										setCampaign((campaign) => ({
											...campaign,
											people: campaign.people.filter(
												(p) => p.id !== user.id
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
									setCampaign((campaign) => ({
										...campaign,
										people: [...campaign.people, { id }],
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
				{dateStringFormat(session.date)}
			</TableCell>
			<TableCell>
				{session.people.map((user) => (
					<UserChip key={`${session.date}.${user.id}`} user={user} />
				))}
			</TableCell>
			<TableCell align="right">
				<Link
					href={`/campaigns/${session.campaign}/sessions/${session.id}`}
				>
					Edit
				</Link>
			</TableCell>
		</TableRow>
	)
}
