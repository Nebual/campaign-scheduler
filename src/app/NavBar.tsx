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
import CalendarButton from '@/app/CalendarButton'

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
						sx={{ mr: 2, display: 'none' }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div">
						<Tooltip title="Game Planning Manager: Gmanman's cooler brother">
							<span>GPlanMan</span>
						</Tooltip>
					</Typography>
					<Typography sx={{ ml: 2.75, mr: 2 }}>|</Typography>
					<CalendarButton />
					<LoginOrProfileButton />
				</Toolbar>
			</AppBar>
		</Box>
	)
}
