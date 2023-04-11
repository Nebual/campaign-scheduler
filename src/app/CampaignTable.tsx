'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

type CampaignTableProps = {
	rows: { name: string; people: string[] }[]
}

export default function CampaignTable({ rows }: CampaignTableProps) {
	const router = useRouter()
	const [isFetching, setIsFetching] = useState(false)
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
				<Typography variant="h4" component="h1" gutterBottom>
					Campaigns
				</Typography>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>People</TableCell>
								<TableCell>{/*Actions*/}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow
									key={row.name}
									sx={{
										'&:last-child td, &:last-child th': {
											border: 0,
										},
									}}
								>
									<TableCell component="th" scope="row">
										{row.name}
									</TableCell>
									<TableCell>
										{row.people.map((person) => (
											<Typography
												key={`${row.name}.${person}`}
											>
												{person}
											</Typography>
										))}
									</TableCell>
									<TableCell align="right">
										<Button
											onClick={async () => {
												setIsFetching(true)
												await fetch(
													`/campaigns/${row.name}`,
													{
														method: 'PUT',
														body: JSON.stringify({
															...row,
															people: [
																...row.people,
																'test',
															],
														}),
													}
												)
												setIsFetching(false)
												router.refresh()
											}}
											disabled={isFetching}
										>
											Test
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}
