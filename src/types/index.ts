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
