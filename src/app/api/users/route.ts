import { NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'fs/promises'

import type { User } from '@/types'

export async function GET(request: Request) {
	// todo: filter based on requested ids
	return NextResponse.json(await readUsers())
}

export async function PUT(request: Request) {
	const users = await readUsers()
	const updatedUser = await request.json()

	// todo: don't take over other people's users lol
	const index = users.findIndex((row) => row.email === updatedUser.email)
	if (index !== -1) {
		users[index] = {
			...users[index],
			...updatedUser,
		}
	} else {
		const indexById = users.findIndex((row) => row.id === updatedUser.id)
		if (indexById !== -1) {
			users[indexById] = {
				...users[indexById],
				...updatedUser,
			}
		} else {
			if (!updatedUser.id && updatedUser.email) {
				updatedUser.id = updatedUser.email.split('@')[0]
			}
			users.push(updatedUser)
		}
	}
	await writeUsers(users)
	return NextResponse.json({ status: 'OK' })
}

export async function readUsers(): Promise<User[]> {
	return JSON.parse(
		(await readFile('./data/users.json').catch(() => '[]')).toString()
	)
}

// todo: this is a hilariously bad 'database'
export async function writeUsers(users: User[]) {
	await mkdir('./data', { recursive: true })
	await writeFile('./data/users.json', JSON.stringify(users, null, 2))
}
