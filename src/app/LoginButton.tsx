'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'

import {
	GoogleLogin,
	googleLogout,
	GoogleOAuthProvider,
} from '@react-oauth/google'
import { useLocalStorage } from '@rehooks/local-storage'
import Grid from '@mui/material/Grid'
import { Button, IconButton, Link } from '@mui/material'
import UserIcon from '@mui/icons-material/AccountCircle'
import { LoginToken } from '@/types'

export function tokenIsValid(loginToken: LoginToken | null): boolean {
	if (!loginToken) {
		return false
	}
	return loginToken.expiresAt >= Date.now() / 1000
}
function parseJwt(token: string) {
	const base64Url = token.split('.')[1]
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	const jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)

	return JSON.parse(jsonPayload)
}

const oAuthClientId =
	'341262452680-svcd6b3uaqi5ij0ltbtrh539s55t174f.apps.googleusercontent.com'

function LoginButton() {
	const [loginToken, setLoginToken, delLoginToken] =
		useLocalStorage<LoginToken>('googleLogin')
	const [loggedInBefore] = useState(!!loginToken)

	return (
		<GoogleOAuthProvider clientId={oAuthClientId}>
			<Grid item>
				{!tokenIsValid(loginToken) ? (
					<GoogleLogin
						auto_select
						useOneTap={loggedInBefore}
						itp_support
						onSuccess={async (response) => {
							if (!response.credential) {
								console.warn('Google Login: No credential')
								return
							}

							const credential = parseJwt(response.credential)
							console.debug(
								'Google Login: Success',
								response,
								credential
							)
							const res = await fetch('/api/users', {
								method: 'PUT',
								body: JSON.stringify({
									avatar: credential.picture,
									email: credential.email,
									lastLogin: new Date().toISOString(),
								}),
							})
							const responseData = await res.json()

							setLoginToken({
								idToken: response.credential,
								expiresAt: credential.exp,
								id: responseData.id,
								email: credential.email,
								avatar: credential.picture,
							})
						}}
					/>
				) : (
					<Link href="/profile" color="#fff">
						<IconButton color="inherit">
							<UserIcon />
						</IconButton>
					</Link>
				)}
			</Grid>
		</GoogleOAuthProvider>
	)
}

function LogoutButtonComponent() {
	const [loginToken, _, delLoginToken] =
		useLocalStorage<LoginToken>('googleLogin')
	return (
		<Button
			color="inherit"
			disabled={!loginToken}
			onClick={() => {
				googleLogout()
				delLoginToken()
			}}
		>
			Logout
		</Button>
	)
}

// SSR seems to hate this (errors on hydrate), so lets disable SSR
export default dynamic(async () => LoginButton, {
	ssr: false,
})
export const LogoutButton = dynamic(async () => LogoutButtonComponent, {
	ssr: false,
})
