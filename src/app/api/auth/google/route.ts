import { NextResponse } from 'next/server'

import { OAuth2Client } from 'google-auth-library'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { parseJwt } from '@/util'
import { Credentials } from 'google-auth-library/build/src/auth/credentials'

export function createOAuth2Client() {
	return new OAuth2Client(
		process.env.NEXT_PUBLIC_CLIENT_ID,
		process.env.CLIENT_SECRET,
		'postmessage'
	)
}

export async function POST(request: Request) {
	const body = await request.json()

	const oAuth2Client = createOAuth2Client()
	const { tokens } = await oAuth2Client.getToken(body.code) // exchange code for tokens
	await writeToken(tokens)

	return NextResponse.json(tokens)
}

export async function writeToken(token: Credentials) {
	const email = parseJwt(token.id_token || '').email

	await mkdir('./data/tokens/', { recursive: true })
	await writeFile(
		`./data/tokens/${email}.json`,
		JSON.stringify(token, null, 2)
	)
}

export async function readToken(email: string): Promise<Credentials> {
	return await readFile(`./data/tokens/${email}.json`)
		.catch(() => '{}')
		.then((x) => x.toString())
		.then((x) => JSON.parse(x))
}

export async function getRefreshedAccessToken(
	email: string
): Promise<string | null> {
	let credentials = await readToken(email)

	const oAuth2Client = createOAuth2Client()
	oAuth2Client.setCredentials(credentials)
	const newAccessToken = await oAuth2Client.getAccessToken()
	if (newAccessToken.token !== credentials.access_token) {
		await writeToken(oAuth2Client.credentials)
	}
	return newAccessToken.token || null
}
