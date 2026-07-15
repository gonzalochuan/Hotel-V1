import { api } from './api'

export type ApiRoomImage = {
  id: string
  roomId: string
  url: string
  isPrimary: boolean
  sortOrder: number
}

export type ApiRoomAmenity = {
  icon: string
  label: string
}

export type ApiRoom = {
  id: string
  name: string
  description: string
  roomType: string
  price: number
  discountPercent: number
  capacity: number
  sizeSqm: number
  features: string[]
  amenities: ApiRoomAmenity[]
  images: ApiRoomImage[]
}

// Adapts the shared backend Room shape into this app's existing RoomItem
// shape so RoomsSection/SearchPage/DetailsPage/PaymentsPage keep working
// with minimal changes. `beds` and `size` have no direct backend field,
// so they're derived from `features`/`sizeSqm`/`capacity`.
export interface RoomItem {
  id: string
  name: string
  price: string
  priceValue: number
  basePriceValue: number
  discountPercent: number
  image: string
  description: string
  size: string
  beds: string
  maxGuests: number
  category: string
  amenities: ApiRoomAmenity[]
}

function primaryImageUrl(room: ApiRoom): string {
  const sorted = [...room.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
  return sorted[0]?.url ?? ''
}

function deriveBeds(room: ApiRoom): string {
  const bedFeature = room.features.find((feature) => /bed/i.test(feature))
  if (bedFeature) return bedFeature
  return `Sleeps ${room.capacity}`
}

export function mapRoomToItem(room: ApiRoom): RoomItem {
  const discountPercent = room.discountPercent ?? 0
  const effectivePrice = discountPercent > 0 ? Math.round(room.price * (1 - discountPercent / 100)) : room.price

  return {
    id: room.id,
    name: room.name,
    price: `₱${effectivePrice.toLocaleString('en-PH')}`,
    priceValue: effectivePrice,
    basePriceValue: room.price,
    discountPercent,
    image: primaryImageUrl(room),
    description: room.description,
    size: `${room.sizeSqm} m²`,
    beds: deriveBeds(room),
    maxGuests: room.capacity,
    category: room.roomType,
    amenities: room.amenities,
  }
}

export function fetchRooms(): Promise<ApiRoom[]> {
  return api.get<ApiRoom[]>('/rooms')
}
