import { ApiError } from './api'

const API_URL = import.meta.env.VITE_API_URL

export type BookingEnhancement = {
  id: string
  label: string
  price: number
}

export type BookingInput = {
  roomId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomsCount: number
  enhancements: BookingEnhancement[]
  subtotal: number
  taxes: number
  total: number
}

export type Booking = BookingInput & {
  id: string
  userId: string
  roomName: string | null
  roomImage: string | null
  status: string
  createdAt: string
}

async function authedRequest<T>(path: string, accessToken: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.error ?? `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function createBooking(input: BookingInput, accessToken: string): Promise<Booking> {
  return authedRequest<Booking>('/bookings', accessToken, { method: 'POST', body: JSON.stringify(input) })
}

export function fetchMyBookings(accessToken: string): Promise<Booking[]> {
  return authedRequest<Booking[]>('/bookings/mine', accessToken)
}

export async function checkRoomAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
  const params = new URLSearchParams({ roomId, checkIn, checkOut })
  const response = await fetch(`${API_URL}/bookings/availability?${params.toString()}`)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.error ?? `Request failed with status ${response.status}`)
  }
  const json = (await response.json()) as { available: boolean }
  return json.available
}
