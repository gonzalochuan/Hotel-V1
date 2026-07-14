// Encodes/decodes BookingData to and from URL search params so the
// selected dates & guests survive navigation between pages.

import { BookingData } from '@/types'

export const encodeBookingQuery = (data: BookingData): string => {
  const params = new URLSearchParams({
    checkIn: data.dates.checkIn.toISOString().slice(0, 10),
    checkOut: data.dates.checkOut.toISOString().slice(0, 10),
    rooms: String(data.guests.rooms),
    adults: String(data.guests.adults),
    children: String(data.guests.children),
  })
  if (data.specialCode) params.set('code', data.specialCode)
  return params.toString()
}

export const decodeBookingQuery = (
  params: URLSearchParams,
  fallback: BookingData
): BookingData => {
  const checkInStr = params.get('checkIn')
  const checkOutStr = params.get('checkOut')

  return {
    dates: {
      checkIn: checkInStr ? new Date(`${checkInStr}T00:00:00`) : fallback.dates.checkIn,
      checkOut: checkOutStr ? new Date(`${checkOutStr}T00:00:00`) : fallback.dates.checkOut,
    },
    guests: {
      rooms: Number(params.get('rooms')) || fallback.guests.rooms,
      adults: Number(params.get('adults')) || fallback.guests.adults,
      children: Number(params.get('children')) || fallback.guests.children,
    },
    specialCode: params.get('code') || fallback.specialCode || '',
  }
}
