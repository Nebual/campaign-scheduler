import { mkdir, readFile, writeFile } from 'fs/promises'

export type Session = {
	id: string // three-word-slug
	campaign: string
	date: string
	people: string[]
}

export type Campaign = {
	name: string
	people: string[]
	sessions: Session[]
}

export async function readCampaigns(): Promise<Campaign[]> {
	return JSON.parse(
		(await readFile('./data/campaigns.json').catch(() => '[]')).toString()
	)
}

// todo: this is a hilariously bad 'database'
export async function writeCampaigns(campaigns: Campaign[]) {
	await mkdir('./data', { recursive: true })
	campaigns = campaigns.map((campaign: Campaign) => ({
		...campaign,
		sessions: campaign.sessions
			.map((session: Session) => ({
				...session,
				campaign: campaign.name, // always save latest name
			}))
			.sort(
				(a: Session, b: Session) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			),
	}))
	await writeFile('./data/campaigns.json', JSON.stringify(campaigns, null, 2))
}
