/** @jsxImportSource react */
import React from 'react'

import CampaignTable from './CampaignTable'
import { readCampaigns } from '@/campaignDb'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Campaigns() {
	const rows = await readCampaigns()

	return <CampaignTable rows={rows} />
}
