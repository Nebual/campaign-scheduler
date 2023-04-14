import { NextRequest, NextResponse } from 'next/server'
import { readCampaigns, writeCampaigns } from '@/campaignDb'

export async function PUT(
	request: NextRequest,
	{ params: { campaign } }: { params: { campaign: string } }
) {
	campaign = decodeURI(campaign)
	const rows = await readCampaigns()
	const index = rows.findIndex((row) => row.name === campaign)
	const updatedRow = await request.json()
	if (index === -1) {
		rows.push(updatedRow)
	} else {
		rows[index] = updatedRow
	}
	await writeCampaigns(rows)
	return NextResponse.json(updatedRow)
}
