'use client'
import React, { useEffect } from 'react'

import { useLocalStorage } from '@rehooks/local-storage'
import { LoginToken } from '@/types'
import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import Garbage from './Garbage'
import LoginButton, { LogoutButton } from '@/app/LoginButton'
import dynamic from 'next/dynamic'

function ProfileView() {
	const [loginToken, setLoginToken] =
		useLocalStorage<LoginToken>('googleLogin')
	const [idError, setIdError] = React.useState('')
	const [id, setId] = React.useState(loginToken?.id || '')
	useEffect(() => {
		setId(loginToken?.id || '')
	}, [loginToken?.id])

	const contents = (
		<Box
			sx={{
				mt: 2,
				display: 'flex',
				flexDirection: 'column',

				'& .MuiTextField-root': { my: 1, width: '40ch' },
			}}
		>
			<Tooltip
				title="Your email is solely used for authentication; it is not directly used or revealed to others. I'm only displaying it here in case you forgot it."
				placement="top"
			>
				<TextField
					label="Email"
					value={loginToken?.email || ''}
					InputLabelProps={{ shrink: true }}
					disabled
				/>
			</Tooltip>
			<TextField
				value={id}
				label="ID"
				InputLabelProps={{ shrink: true }}
				onChange={async (e) => {
					setId(e.target.value)

					const res = await fetch('/api/users', {
						method: 'PUT',
						body: JSON.stringify({
							id: e.target.value,
							email: loginToken?.email,
						}),
					})
					const resultData = await res.json()
					if (res.status === 200) {
						setIdError('')
						setLoginToken({
							...(loginToken as LoginToken),
							id: e.target.value,
						})
					} else if (res.status === 409) {
						setIdError(resultData.message)
					} else {
						setIdError('Failed saving ID')
					}
				}}
				error={!!idError}
				helperText={
					idError || (
						<span>
							This is your identifier, used to add you to
							sessions.
							<br />
							eg. your Discord alias.
						</span>
					)
				}
			/>

			<Garbage />
		</Box>
	)

	return (
		<Container
			maxWidth="lg"
			sx={{
				my: 4,
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
					<Typography>Profile</Typography>
				</Breadcrumbs>
				<Box sx={{ mx: 'auto' }} />
				<LogoutButton />
			</Box>
			<Container maxWidth="sm">
				{loginToken ? contents : <LoginButton />}
			</Container>
		</Container>
	)
}

// SSR seems to hate this (errors on hydrate), so lets disable SSR
export default dynamic(async () => ProfileView, {
	ssr: false,
})
