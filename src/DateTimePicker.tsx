import { KeyboardEvent, useRef } from 'react'

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
	const fieldValueRef = useRef(dayjs(value))
	function onDateAccept() {
		setValue(
			fieldValueRef.current
				.set('second', 0)
				.set('millisecond', 0)
				.toISOString()
		)
	}

	return (
		<MuiDateTimePicker
			value={fieldValueRef.current}
			onChange={(newValue) => {
				if (newValue) {
					fieldValueRef.current = newValue
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
							...params.sx,
							'& fieldset': { border: 'none' },
							'&': { maxWidth: '14rem' }, // probably a bad idea, but why is there all that whitespace?
						}}
					/>
				),
			}}
		/>
	)
}
