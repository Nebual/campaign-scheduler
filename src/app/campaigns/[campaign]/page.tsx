/** @jsxImportSource react */
import React from 'react'

import { readCampaignWithDefault } from '@/campaignDb'
import CampaignView from '@/app/campaigns/[campaign]/CampaignView'

export default async function CampaignPage({
	params: { campaign },
}: {
	params: { campaign: string }
}) {
	const campaignData = await readCampaignWithDefault(campaign)

	return <CampaignView campaign={campaignData} />
}
