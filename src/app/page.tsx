'use client'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

export default function Home() {
	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					my: 4,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant="h4" component="h1" gutterBottom>
					Material UI - Next.js example in TypeScript
				</Typography>
				<Link href="/about" color="primary" underline="none">
					Go to the about page
				</Link>
			</Box>
		</Container>
	)
}
