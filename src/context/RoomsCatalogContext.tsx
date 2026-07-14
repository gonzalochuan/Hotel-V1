import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchRooms, mapRoomToItem, type RoomItem } from '@/services/roomsApi'

type RoomsCatalogContextValue = {
  rooms: RoomItem[]
  categories: string[]
  loading: boolean
  error: string | null
}

const RoomsCatalogContext = createContext<RoomsCatalogContextValue | null>(null)

export function RoomsCatalogProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<RoomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchRooms()
      .then((apiRooms) => {
        if (cancelled) return
        setRooms(apiRooms.map(mapRoomToItem))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load rooms')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => Array.from(new Set(rooms.map((room) => room.category))), [rooms])

  const value = useMemo(() => ({ rooms, categories, loading, error }), [rooms, categories, loading, error])

  return <RoomsCatalogContext.Provider value={value}>{children}</RoomsCatalogContext.Provider>
}

export function useRoomsCatalog() {
  const ctx = useContext(RoomsCatalogContext)
  if (!ctx) throw new Error('useRoomsCatalog must be used within a RoomsCatalogProvider')
  return ctx
}
