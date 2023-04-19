import { NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'fs/promises'

import type { User } from '@/types'

export async function GET(request: Request) {
	// todo: filter based on requested ids
	return NextResponse.json(await readUsers())
}

export async function PUT(request: Request) {
	const users = await readUsers()
	const patchUser = await request.json()

	if (
		patchUser.id &&
		patchUser.email &&
		users.find(
			(row) => row.id === patchUser.id && row.email !== patchUser.email
		)
	) {
		return NextResponse.json(
			{ message: 'ID already in use' },
			{ status: 409 }
		)
	}
	let updatedUser

	const index = users.findIndex((row) => row.email === patchUser.email)
	if (index !== -1) {
		users[index] = updatedUser = {
			...users[index],
			...patchUser,
		}
	} else {
		const indexById = users.findIndex((row) => row.id === patchUser.id)
		if (indexById !== -1) {
			users[indexById] = updatedUser = {
				...users[indexById],
				...patchUser,
			}
		} else {
			if (!patchUser.id && patchUser.email) {
				patchUser.id = patchUser.email.split('@')[0]
			}
			updatedUser = patchUser
			users.push(patchUser)
		}
	}
	await writeUsers(users)
	return NextResponse.json(updatedUser)
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
