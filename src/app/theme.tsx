import React, { forwardRef } from 'react'

import { createTheme } from '@mui/material/styles'
import NextLink from 'next/link'

const LinkBehaviour = forwardRef((props: any, ref: any) => {
	const { href } = props
	return <NextLink ref={ref} href={href} {...props} />
})

LinkBehaviour.displayName = 'MuiLinkWrapper'

export const theme = createTheme({
	components: {
		MuiLink: {
			defaultProps: {
				component: LinkBehaviour,
			} as any,
		},
		MuiButtonBase: {
			defaultProps: {
				LinkComponent: LinkBehaviour,
			},
		},
	},
})
