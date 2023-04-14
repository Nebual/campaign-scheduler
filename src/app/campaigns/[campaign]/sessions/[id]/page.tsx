/** @jsxImportSource react */
import React from 'react'
import dayjs from 'dayjs'

import { readCampaignWithDefault } from '@/campaignDb'
import SessionView from './SessionView'
import { generateSlug } from 'random-word-slugs'

export default async function SessionPage({
	params: { campaign, id },
}: {
	params: { campaign: string; id: string }
}) {
	const campaignData = await readCampaignWithDefault(campaign)

	const sessionData = campaignData.sessions.find((row) => row.id === id) || {
		id: generateSlug(),
		campaign: campaignData.name,
		date: dayjs().add(1, 'day').toISOString(),
		people: [...campaignData.people],
	}

	return <SessionView session={sessionData} />
}
