'use client'

import {
	AppBar,
	Box,
	IconButton,
	Tooltip,
	Toolbar,
	Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { LoginOrProfileButton } from './LoginButton'

export default function NavBar() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2, opacity: 0 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						<Tooltip title="Game Planning Manager: Gmanman's cooler brother">
							<span>GPlanMan</span>
						</Tooltip>
					</Typography>
					<LoginOrProfileButton />
				</Toolbar>
			</AppBar>
		</Box>
	)
}
