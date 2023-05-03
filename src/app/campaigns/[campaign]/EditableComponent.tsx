'use client'

import { useState, ReactNode } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

export default function EditableComponent({
	value,
	setValue,
	normalComponent,
}: {
	value: string
	setValue: (value: string) => void
	normalComponent: ReactNode
}) {
	const [editing, setEditing] = useState(false)

	return editing ? (
		<TextField
			defaultValue={value !== 'New Campaign' ? value : ''}
			autoFocus
			onBlur={(e) => {
				if (e.target.value) {
					setValue(e.target.value)
				}
				setEditing(false)
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					setValue((e.target as HTMLInputElement).value)
					setEditing(false)
				}
			}}
		/>
	) : (
		<Box sx={{ display: 'inline-flex', alignItems: 'baseline' }}>
			{normalComponent}
			<IconButton onClick={() => setEditing(true)} sx={{ ml: 1 }}>
				<EditIcon />
			</IconButton>
		</Box>
	)
}
