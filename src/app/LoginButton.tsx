'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import {
	googleLogout,
	GoogleOAuthProvider,
	useGoogleLogin,
} from '@react-oauth/google'
import { useLocalStorage } from '@rehooks/local-storage'
import Grid from '@mui/material/Grid'
import { Button, IconButton, Link } from '@mui/material'
import UserIcon from '@mui/icons-material/AccountCircle'
import { LoginToken } from '@/types'
import loginIconNormal from '@/../public/login/btn_google_signin_light_normal_web@2x.png'
import loginIconHovering from '@/../public/login/btn_google_signin_light_pressed_web@2x.png'
import { parseJwt } from '@/util'

export function tokenIsValid(loginToken: LoginToken | null): boolean {
	if (!loginToken) {
		return false
	}
	return loginToken.expiresAt >= Date.now() / 1000
}

function LoginButton() {
	const [loginToken, setLoginToken] =
		useLocalStorage<LoginToken>('googleLogin')

	const login = useGoogleLogin({
		flow: 'auth-code',
		hint: loginToken?.email,
		onSuccess: async (codeResponse) => {
			const response = await fetch('/api/auth/google/', {
				method: 'POST',
				body: JSON.stringify({
					code: codeResponse.code,
				}),
			}).then((res) => res.json())

			if (!response.access_token) {
				console.warn('Google Login: No access_token')
				return
			}

			const credential = parseJwt(response.id_token)

			console.debug('Google Login: Success', response, credential)
			const responseData = await fetch('/api/users', {
				method: 'PUT',
				body: JSON.stringify({
					avatar: credential.picture,
					email: credential.email,
					lastLogin: new Date().toISOString(),
				}),
			}).then((res) => res.json())

			setLoginToken({
				idToken: response.access_token,
				expiresAt: response.expiry_date / 1000,
				id: responseData.id,
				email: credential.email,
				avatar: credential.picture,
			})
		},
		onError: (error) => {
			console.error('Google Login: Error ', error)
		},
	})

	const [hovering, setHovering] = useState(false)

	return (
		<Button
			onClick={() => login()}
			variant="text"
			size="small"
			sx={{
				padding: 0,
			}}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			<Image
				src={hovering ? loginIconHovering : loginIconNormal}
				alt=""
				height={48}
			/>
		</Button>
	)
}

function LoginButtonWrapper() {
	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ''}>
			<LoginButton />
		</GoogleOAuthProvider>
	)
}

function LoginOrProfileButtonComponent() {
	const [loginToken] = useLocalStorage<LoginToken>('googleLogin')
	return (
		<Grid item>
			{!loginToken?.email ? (
				<LoginButtonWrapper />
			) : (
				<Link href="/profile" color="#fff">
					<IconButton color="inherit">
						<UserIcon />
					</IconButton>
				</Link>
			)}
		</Grid>
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
export default dynamic(async () => LoginButtonWrapper, {
	ssr: false,
})
export const LoginOrProfileButton = dynamic(
	async () => LoginOrProfileButtonComponent,
	{
		ssr: false,
	}
)
export const LogoutButton = dynamic(async () => LogoutButtonComponent, {
	ssr: false,
})
