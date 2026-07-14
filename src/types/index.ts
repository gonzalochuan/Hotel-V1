export interface BookingData {
  dates: {
    checkIn: Date
    checkOut: Date
  }
  guests: {
    rooms: number
    adults: number
    children: number
  }
  specialCode?: string
}

export interface Room {
  id: string
  name: string
  description: string
  price: number
  image: string
  amenities: string[]
}

export interface Hotel {
  id: string
  name: string
  location: string
  description: string
  rating: number
  images: string[]
  rooms: Room[]
}
