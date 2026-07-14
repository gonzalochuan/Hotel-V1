// Shared room inventory used by the homepage Accommodation section and the Search page

export type Category = 'Rooms' | 'Suites' | 'Signature Suites' | 'Accessible Rooms'

export const FILTERS: Array<Category | 'All'> = ['All', 'Rooms', 'Suites', 'Signature Suites', 'Accessible Rooms']

// Fixed vocabulary — rendered via the ICON_MAP in SearchPage/DetailsPage
export type AmenityLabel =
  | 'Free WiFi'
  | 'Air Conditioning'
  | 'Flat-Screen TV'
  | 'Mini Bar'
  | 'City View'
  | 'Garden View'
  | 'Ocean View'
  | 'Private Balcony'
  | 'Bathtub'
  | 'Living Area'
  | 'Connecting Rooms'

export interface RoomItem {
  id: number
  name: string
  price: string
  priceValue: number
  image: string
  description: string
  size: string
  beds: string
  maxGuests: number
  category: Category
  amenities: AmenityLabel[]
}

export const ROOMS: RoomItem[] = [
  {
    id: 1,
    name: 'Deluxe Room',
    price: '₱8,500',
    priceValue: 8500,
    image: '/image/room.jpg',
    description:
      'A spacious retreat with sweeping city views, dressed in warm, contemporary furnishings. Unwind on the plush king bed after a day of exploring, or catch up on work at the dedicated desk with skyline views.',
    size: '45 m²',
    beds: '1 King Bed',
    maxGuests: 2,
    category: 'Rooms',
    amenities: ['City View', 'Free WiFi', 'Air Conditioning', 'Flat-Screen TV'],
  },
  {
    id: 2,
    name: 'Executive Suite',
    price: '₱15,000',
    priceValue: 15000,
    image: '/image/room2.jpg',
    description:
      'A generous suite with a separate living area, perfect for travelers who want room to breathe. Sink into the lounge seating for a nightcap from the mini bar before retiring to the king bed.',
    size: '65 m²',
    beds: '1 King Bed',
    maxGuests: 2,
    category: 'Suites',
    amenities: ['Living Area', 'Free WiFi', 'Air Conditioning', 'Mini Bar'],
  },
  {
    id: 3,
    name: 'Presidential Suite',
    price: '₱25,000',
    priceValue: 25000,
    image: '/image/room3.jpg',
    description:
      'The ultimate expression of island luxury, with a private balcony, deep soaking bathtub, and two king beds spread across an expansive floor plan built for indulgent, unhurried stays.',
    size: '120 m²',
    beds: '2 King Beds',
    maxGuests: 4,
    category: 'Signature Suites',
    amenities: ['Private Balcony', 'Bathtub', 'Free WiFi', 'Mini Bar'],
  },
  {
    id: 4,
    name: 'Garden View Room',
    price: '₱10,500',
    priceValue: 10500,
    image: '/image/room4.jpg',
    description:
      'A peaceful hideaway overlooking lush tropical gardens, ideal for guests seeking quiet mornings and calm evenings. The queen bed and soft natural light make this room a restful escape.',
    size: '50 m²',
    beds: '1 Queen Bed',
    maxGuests: 2,
    category: 'Rooms',
    amenities: ['Garden View', 'Free WiFi', 'Air Conditioning', 'Flat-Screen TV'],
  },
  {
    id: 5,
    name: 'Ocean Suite',
    price: '₱18,000',
    priceValue: 18000,
    image: '/image/room5.jpg',
    description:
      'Wake up to uninterrupted ocean views from this airy suite, where the sound of the waves sets the pace for your stay. A king bed and thoughtful in-room touches complete the experience.',
    size: '75 m²',
    beds: '1 King Bed',
    maxGuests: 3,
    category: 'Suites',
    amenities: ['Ocean View', 'Free WiFi', 'Air Conditioning', 'Mini Bar'],
  },
  {
    id: 6,
    name: 'Family Suite',
    price: '₱20,000',
    priceValue: 20000,
    image: '/image/room6.jpg',
    description:
      'Built for families and small groups, with connecting rooms and two queen beds that give everyone their own space while staying close together, all wrapped in the same relaxed comfort.',
    size: '90 m²',
    beds: '2 Queen Beds',
    maxGuests: 4,
    category: 'Accessible Rooms',
    amenities: ['Connecting Rooms', 'Free WiFi', 'Air Conditioning', 'Flat-Screen TV'],
  }
]
