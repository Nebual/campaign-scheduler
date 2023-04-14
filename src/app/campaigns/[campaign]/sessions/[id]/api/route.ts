import { NextRequest, NextResponse } from 'next/server'
import { readCampaigns, writeCampaigns } from '@/campaignDb'

export async function PUT(
	request: NextRequest,
	{ params: { campaign, id } }: { params: { campaign: string; id: string } }
) {
	campaign = decodeURI(campaign)
	const campaigns = await readCampaigns()
	const campaignData = campaigns.find((row) => row.name === campaign)
	if (!campaignData) {
		return NextResponse.error()
	}

	const index = campaignData.sessions.findIndex((row) => row.id === id)
	const updatedRow = await request.json()
	if (index === -1) {
		campaignData.sessions.push(updatedRow)
	} else {
		campaignData.sessions[index] = updatedRow
	}
	await writeCampaigns(campaigns)

	return NextResponse.json(updatedRow)
}
