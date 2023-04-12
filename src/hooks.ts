import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
