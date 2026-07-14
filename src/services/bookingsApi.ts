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
  status: string
  createdAt: string
}

export async function createBooking(input: BookingInput, accessToken: string): Promise<Booking> {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.error ?? `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<Booking>
}
