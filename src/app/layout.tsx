/** @jsxImportSource react */

import { MuiSetup } from './MuiSetup'
import NavBar from './NavBar'

export const metadata = {
	title: 'GPlanMan',
	description: "Game Planning Manager: Gmanman's cooler brother",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<MuiSetup>
					<NavBar />
					{children}
				</MuiSetup>
			</body>
		</html>
	)
}
