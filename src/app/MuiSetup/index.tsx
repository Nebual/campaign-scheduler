'use client'

import React, { forwardRef, ReactNode } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material'

import { EmotionCacheProvider } from './EmotionCacheProvider'
import { theme } from '../theme'

type Props = {
	children: ReactNode
}

export const MuiSetup = ({ children }: Props) => {
	return (
		<>
			<CssBaseline />
			{/* MUI (but actually underlying Emotion) isn't ready to work with Next's experimental `app/` directory feature.
          I'm using the lowest-code approach suggested by this guy here: https://github.com/emotion-js/emotion/issues/2928#issuecomment-1386197925 */}
			<EmotionCacheProvider options={{ key: 'css' }}>
				<ThemeProvider theme={theme}>{children}</ThemeProvider>
			</EmotionCacheProvider>
		</>
	)
}
