import { NextResponse } from 'next/server'

import { OAuth2Client } from 'google-auth-library'
import { mkdir, writeFile } from 'fs/promises'
import { parseJwt } from '@/util'

const oAuth2Client = new OAuth2Client(
	process.env.NEXT_PUBLIC_CLIENT_ID,
	process.env.CLIENT_SECRET,
	'postmessage'
)

export async function POST(request: Request) {
	const body = await request.json()
	const { tokens } = await oAuth2Client.getToken(body.code) // exchange code for tokens
	await writeToken(tokens)

	return NextResponse.json(tokens)
}

async function writeToken(token: any) {
	const email = parseJwt(token.id_token).email

	await mkdir('./data/tokens/', { recursive: true })
	await writeFile(
		`./data/tokens/${email}.json`,
		JSON.stringify(token, null, 2)
	)
}
