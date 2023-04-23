export type Campaign = {
	name: string
	people: User[]
	sessions: Session[]
}

export type Session = {
	id: string // three-word-slug
	campaign: string
	date: string
	people: User[]
}

export type User = {
	id: string
	email?: string
	avatar?: string
	enabledCalendars?: string[]
}

export type LoginToken = {
	idToken: string
	expiresAt: number
	id: string
	email: string
	avatar: string
}
