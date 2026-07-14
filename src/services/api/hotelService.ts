// API Service Layer - For future API integration
// This follows SOLID principles by separating business logic from presentation

import { Hotel, BookingData } from '@/types'

export class HotelService {
  private static instance: HotelService

  private constructor() {}

  public static getInstance(): HotelService {
    if (!HotelService.instance) {
      HotelService.instance = new HotelService()
    }
    return HotelService.instance
  }

  // Future: Fetch hotels from API
  async getHotels(): Promise<Hotel[]> {
    // Mock data for now
    return []
  }

  // Future: Fetch hotel details by ID
  async getHotelById(id: string): Promise<Hotel | null> {
    // Mock data for now
    return null
  }

  // Future: Search hotels with filters
  async searchHotels(filters: BookingData): Promise<Hotel[]> {
    // Mock data for now
    return []
  }

  // Future: Create booking
  async createBooking(booking: BookingData): Promise<any> {
    // Mock implementation
    return { success: true, bookingId: 'mock-id' }
  }
}

export default HotelService.getInstance()
