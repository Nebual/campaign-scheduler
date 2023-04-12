import { mkdir, readFile, writeFile } from 'fs/promises'

export async function readCampaigns(): Promise<Campaign[]> {
	return JSON.parse(
		(await readFile('./data/campaigns.json').catch(() => '[]')).toString()
	)
}

// todo: this is a hilariously bad 'database'
export async function writeCampaigns(rows: Campaign[]) {
	await mkdir('./data', { recursive: true })
	await writeFile('./data/campaigns.json', JSON.stringify(rows, null, 2))
}

export type Session = {
	campaign: string
	date: string
	people: string[]
}

export type Campaign = {
	name: string
	people: string[]
	sessions: Session[]
}
