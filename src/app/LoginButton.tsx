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
import { Button } from '@mui/material'

export function tokenIsValid(loginToken: LoginToken | null): boolean {
	if (!loginToken) {
		return false
	}
	return loginToken.expires_at >= Date.now() / 1000
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

type LoginToken = {
	id_token: string
	expires_at: number
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
							setLoginToken({
								id_token: response.credential,
								expires_at: credential.exp,
							})
							await fetch('/api/users', {
								method: 'PUT',
								body: JSON.stringify({
									avatar: credential.picture,
									email: credential.email,
								}),
							})
						}}
					/>
				) : (
					<Button
						color="inherit"
						onClick={() => {
							googleLogout()
							delLoginToken()
						}}
					>
						Logout
					</Button>
				)}
			</Grid>
		</GoogleOAuthProvider>
	)
}

// SSR seems to hate this (errors on hydrate), so lets disable SSR
export default dynamic(async () => LoginButton, {
	ssr: false,
})
