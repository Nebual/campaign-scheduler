/** @jsxImportSource react */
import React from 'react'
import dayjs from 'dayjs'

import { readCampaigns } from '@/campaignDb'
import SessionView from './SessionView'
import { generateSlug } from 'random-word-slugs'

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
	const sessionData = campaignData.sessions.find((row) => row.id === id) || {
		id: generateSlug(),
		campaign: campaignData.name,
		date: dayjs().add(1, 'day').toISOString(),
		people: [...campaignData.people],
	}

	return <SessionView session={sessionData} />
}
