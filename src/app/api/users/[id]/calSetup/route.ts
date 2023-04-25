import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

import { getRefreshedAccessToken } from '@/app/api/auth/google/route'
import { readUsers } from '@/app/api/users/route'

export async function GET(
	request: Request,
	{ params: { id } }: { params: { id: string } }
) {
	// todo: apply auth, maybe store access tokens associated with a user (which expire after 30d, instead of 1h as Google's do) in sessions.json (or node-cache to disk?) or a db lol
	const users = await readUsers()
	const user = users.find((user) => user.id === id)
	if (!user?.email) {
		return NextResponse.json({ message: 'ID not found' }, { status: 404 })
	}
	const accessToken = (await getRefreshedAccessToken(user.email)) || ''

	const calendars = await fetch(
		'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
		.then((res) => res.json())
		.then((response) =>
			response.items
				.filter(
					(item: any) =>
						!item.id.includes('#holiday') &&
						!item.id.includes('#contacts') &&
						!item.id.includes('@import.calendar.google.com')
				)
				.sort(
					(a: any, b: any) =>
						(b.selected ? 1 : 0) - (a.selected ? 1 : 0) ||
						a.summary.localeCompare(b.summary)
				)
		)

	const freeBusyCalendars = await fetch(
		'https://www.googleapis.com/calendar/v3/freeBusy',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				timeMin: new Date().toISOString(),
				timeMax: dayjs().add(1, 'month').toISOString(),
				items: calendars.map((item: any) => ({ id: item.id })),
			}),
		}
	)
		.then((res) => res.json())
		.then((res) => res?.calendars || {})

	return NextResponse.json({
		calendars,
		freeBusyCalendars,
		enabledCalendars: user.enabledCalendars,
		invertedCalendars: user.invertedCalendars,
	})
}
