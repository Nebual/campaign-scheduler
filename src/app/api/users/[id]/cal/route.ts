import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import NodeCache from 'node-cache'

import { getRefreshedAccessToken } from '@/app/api/auth/google/route'
import { readUsers } from '@/app/api/users/route'
import { busyResponseToEvents } from '@/calendarUtil'

export async function GET(
	request: Request,
	{ params: { id } }: { params: { id: string } }
) {
	id = id.toLowerCase()
	const users = await readUsers()
	const user = users.find((user) => user.id.toLowerCase() === id)
	if (!user?.email || !user.enabledCalendars) {
		return NextResponse.json({ message: 'ID not found' }, { status: 404 })
	}
	const accessToken = (await getRefreshedAccessToken(user.email)) || ''

	const freeBusyCalendars = await fetchFreeBusyCalendars(
		accessToken,
		user.enabledCalendars
	)

	const events = busyResponseToEvents({
		freeBusyCalendars,
		enabledCalendars: user.enabledCalendars,
		invertedCalendars: user.invertedCalendars || [],
		name: user.id,
		combineAcrossCalendars: true,
	})

	return NextResponse.json({ events: events })
}

const calCache = new NodeCache({ stdTTL: 120 })
const fetchFreeBusyCalendars = async (
	accessToken: string,
	enabledCalendars: string[]
) => {
	const cacheKey = `freebusy-${enabledCalendars.join(',')}`
	if (calCache.has(cacheKey)) {
		return calCache.get(cacheKey)
	}

	const timeMin = dayjs().startOf('day')
	const results = await fetch(
		'https://www.googleapis.com/calendar/v3/freeBusy',
		{
			next: { revalidate: 60 },
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				timeMin: timeMin.toISOString(),
				timeMax: timeMin.add(1, 'month').toISOString(),
				items: enabledCalendars.map((id) => ({ id })),
			}),
		}
	)
		.then((res) => res.json())
		.then((response) => response?.calendars)

	calCache.set(cacheKey, results)
	return results
}
