/** @jsxImportSource react */
import React from 'react'
import dayjs from 'dayjs'

import { readCampaigns } from '../../util'
import SessionView from './SessionView'

export default async function SessionPage({
	params: { campaign, id },
}: {
	params: { campaign: string; id: string }
}) {
	const campaigns = await readCampaigns()
	const campaignData = campaigns.find((row) => row.name === campaign) || {
		name: 'New Campaign',
		people: [],
		sessions: [],
	}
	const sessionData = campaignData.sessions.find(
		(row) => row.date === id
	) || {
		campaign: campaignData.name,
		date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
		people: [...campaignData.people],
	}

	return <SessionView session={sessionData} />
}
