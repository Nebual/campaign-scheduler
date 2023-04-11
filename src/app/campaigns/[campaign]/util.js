import { mkdir, readFile, writeFile } from 'fs/promises'

export async function readCampaigns() {
	return JSON.parse(
		(await readFile('./data/campaigns.json').catch(() => '[]')).toString()
	)
}

export async function writeCampaigns(rows) {
	await mkdir('./data', { recursive: true })
	await writeFile('./data/campaigns.json', JSON.stringify(rows))
}
