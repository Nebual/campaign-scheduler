import { useState, KeyboardEvent } from 'react'

import TextField from '@mui/material/TextField'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/util'

export default function DateTimePicker({
	value,
	setValue,
}: {
	value: string
	setValue: (value: string) => void
}) {
	const [fieldValue, setFieldValue] = useState(() => dayjs(value))

	function onDateAccept() {
		setValue(
			fieldValue.set('second', 0).set('millisecond', 0).toISOString()
		)
	}

	return (
		<MuiDateTimePicker
			value={fieldValue}
			onChange={(newValue) => {
				if (newValue) {
					setFieldValue(newValue)
				}
			}}
			onAccept={onDateAccept}
			disablePast
			format={DATE_FORMAT}
			slots={{
				textField: (params) => (
					<TextField
						{...params}
						size="small"
						onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
							if (event.key === 'Enter') {
								onDateAccept()
							}
						}}
						sx={{
							'& fieldset': { border: 'none' },
							'&': { maxWidth: '14rem' }, // probably a bad idea, but why is there all that whitespace?
						}}
					/>
				),
			}}
		/>
	)
}
