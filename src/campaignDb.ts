import { mkdir, readFile, writeFile } from 'fs/promises'
import { Campaign, Session, User } from '@/types'
import { readUsers } from '@/app/api/users/route'

export type { Campaign, Session }

export async function readCampaigns(): Promise<Campaign[]> {
	const campaigns = JSON.parse(
		(await readFile('./data/campaigns.json').catch(() => '[]')).toString()
	)
	const knownUsers = await readUsers()
	return campaigns.map((campaign: Campaign) => ({
		...campaign,
		people: campaign.people.map((person: User) => {
			const knownPerson =
				knownUsers.find((user: User) => user.id === person.id) || {}
			return {
				...knownPerson,
				...person,
			}
		}),
		sessions: campaign.sessions.map((session: Session) => ({
			...session,
			people: session.people.map((person: User) => {
				const knownPerson =
					knownUsers.find((user: User) => user.id === person.id) || {}
				return {
					...knownPerson,
					...person,
				}
			}),
		})),
	}))
}

export async function readCampaign(
	campaign: string
): Promise<Campaign | undefined> {
	const campaigns = await readCampaigns()
	campaign = decodeURI(campaign)
	return campaigns.find((row: Campaign) => row.name === campaign)
}
export async function readCampaignWithDefault(
	campaign: string
): Promise<Campaign> {
	return (
		(await readCampaign(campaign)) || {
			name: 'New Campaign',
			people: [],
			sessions: [],
		}
	)
}

// todo: this is a hilariously bad 'database'
export async function writeCampaigns(campaigns: Campaign[]) {
	await mkdir('./data', { recursive: true })
	campaigns = campaigns.map((campaign: Campaign) => ({
		...campaign,
		people: campaign.people.map((person: User) => ({ id: person.id })),
		sessions: campaign.sessions
			.map((session: Session) => ({
				...session,
				campaign: campaign.name, // always save latest name
				people: session.people.map((person: User) => ({
					id: person.id,
				})),
			}))
			.sort(
				(a: Session, b: Session) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			),
	}))
	await writeFile('./data/campaigns.json', JSON.stringify(campaigns, null, 2))
}
