/** @jsxImportSource react */
import React from 'react'

import { readCampaigns } from '@/campaignDb'
import CampaignView from '@/app/campaigns/[campaign]/CampaignView'

export default async function CampaignPage({
	params: { campaign },
}: {
	params: { campaign: string }
}) {
	const rows = await readCampaigns()
	const campaignData = rows.find((row) => row.name === campaign) || {
		name: 'New Campaign',
		people: [],
		sessions: [],
	}

	return <CampaignView campaign={campaignData} />
}
