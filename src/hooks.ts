import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'
import { User } from '@/types'

const loadedPages: { [key: string]: boolean } = {}

export const useRefreshOnSoftNav = (key: string) => {
	const router = useRouter()

	useEffect(() => {
		if (loadedPages[key]) {
			loadedPages[key] = true
			return
		}
		router.refresh()
	}, [key, router])
}

export const useKnownUsers = () => {
	const { data: knownUsers } = useSWR(
		'/api/users',
		async (): Promise<User[]> => await (await fetch(`/api/users`)).json()
	)
	return knownUsers
}
