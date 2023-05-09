'use client'

import React, { useState, ReactElement } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

export default function EditableComponent({
	value,
	setValue,
	normalComponent,
	defaultValue = 'New Campaign',
}: {
	value: string
	setValue: (value: string) => void
	normalComponent: ReactElement
	defaultValue?: string
}) {
	const [editing, setEditing] = useState(false)

	return editing ? (
		<TextField
			defaultValue={value !== defaultValue ? value : ''}
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
			{value === defaultValue
				? React.cloneElement(normalComponent, {
						onClick: () => {
							setEditing(true)
						},
				  })
				: normalComponent}
			<IconButton onClick={() => setEditing(true)} sx={{ ml: 1 }}>
				<EditIcon />
			</IconButton>
		</Box>
	)
}
