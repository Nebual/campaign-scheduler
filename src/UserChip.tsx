import React from 'react'
import { Avatar, Chip } from '@mui/material'
import { User } from '@/types'

interface UserChipProps extends React.ComponentPropsWithoutRef<typeof Chip> {
	user: User
}
export default function UserChip({ user, ...props }: UserChipProps) {
	return (
		<Chip
			label={user.id}
			avatar={user.avatar ? <Avatar src={user.avatar} /> : undefined}
			variant="outlined"
			{...props}
		/>
	)
}
