/** @jsxImportSource react */
import React from 'react'

import CampaignTable from './CampaignTable'
import { readCampaigns } from './campaigns/[campaign]/util'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Campaigns() {
	const rows = await readCampaigns()

	return <CampaignTable rows={rows} />
}
