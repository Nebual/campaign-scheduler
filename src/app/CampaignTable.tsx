'use client'

import { useState } from 'react'
import {
	Autocomplete,
	Box,
	Breadcrumbs,
	Button,
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
	Tooltip,
	Typography,
} from '@mui/material'

import { Campaign } from '@/types'
import { useRefreshOnSoftNav } from '@/hooks'
import { dateStringFormat } from '@/util'

export type PeopleFilterOption = {
	id: string
}

type CampaignTableProps = {
	rows: Campaign[]
}

export default function CampaignTable({ rows }: CampaignTableProps) {
	useRefreshOnSoftNav('/')
	const [filterPeople, setFilterPeople] = useState<PeopleFilterOption[]>([])
	const peopleOptions: PeopleFilterOption[] = Object.values(
		rows
			.map(({ people }) => people)
			.flat()
			.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
	)

	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					my: 4,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						width: '100%',
					}}
				>
					<Breadcrumbs>
						<Tooltip title="Game Planning Manager: Gmanman's cooler brother">
							<Typography>GPlanMan</Typography>
						</Tooltip>
					</Breadcrumbs>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						sx={{ mx: 'auto' }}
					>
						Campaigns
					</Typography>
					<Button href="/campaigns/new">New</Button>
				</Box>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 450 }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell sx={{ py: 1.5 }}>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<span>People</span>
										<Autocomplete
											sx={{
												ml: 2,
												minWidth: 300,
												'& .MuiInputBase-root': {
													minHeight: '4.5ch',
												},
											}}
											value={filterPeople}
											onChange={(
												event: any,
												newValues: PeopleFilterOption[]
											) => {
												setFilterPeople(newValues)
											}}
											options={peopleOptions}
											getOptionLabel={(
												option: PeopleFilterOption
											) => option.id}
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
									</Box>
								</TableCell>
								<TableCell>Last Session</TableCell>
								<TableCell>{/*Actions*/}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows
								.filter((row) => {
									const people = row.people.map(
										({ id }) => id
									)
									return filterPeople.every(({ id }) =>
										people.includes(id)
									)
								})
								.map((row) => (
									<CampaignRow key={row.name} row={row} />
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}

type CampaignRowProps = {
	row: Campaign
}

function CampaignRow({ row }: CampaignRowProps) {
	return (
		<TableRow
			sx={{
				'&:last-child td, &:last-child th': {
					border: 0,
				},
			}}
		>
			<TableCell component="th" scope="row">
				{row.name}
			</TableCell>
			<TableCell>{row.people.map(({ id }) => id).join(', ')}</TableCell>
			<TableCell>
				{row.sessions?.length
					? dateStringFormat(row.sessions[0].date)
					: ''}
			</TableCell>
			<TableCell align="right">
				<Link href={`/campaigns/${row.name}`}>Edit</Link>
			</TableCell>
		</TableRow>
	)
}
