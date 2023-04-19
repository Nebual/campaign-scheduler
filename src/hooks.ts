import { useRouter } from 'next/navigation'
import { useEffect, useRef, EffectCallback, DependencyList } from 'react'
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

/**
 * A useEffect() wrapper (with the same signature), which does not fire when inputs are first defined
 */
export function useEffectAfterInit(
	effect: EffectCallback,
	inputs: DependencyList
): void {
	const isInitialMount = useRef(true)
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false

			return
		}

		return effect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs)
}
