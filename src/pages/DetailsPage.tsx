import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import BookingCalendarModal from '@/components/booking/BookingCalendarModal'
import { useRoomsCatalog } from '@/context/RoomsCatalogContext'
import { BookingData } from '@/types'
import { addDays, formatDateWithWeekday, getDaysBetween, startOfDay } from '@/utils/dateHelpers'
import { decodeBookingQuery, encodeBookingQuery } from '@/utils/bookingQuery'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const ROOM_AMENITIES = [
  {
    label: 'Free WiFi',
    icon: (
      <svg {...iconProps}>
        <path d="M2.5 9.5a14 14 0 0 1 19 0" />
        <path d="M5.8 13.2a9.5 9.5 0 0 1 12.4 0" />
        <path d="M9 16.8a5 5 0 0 1 6 0" />
        <circle cx="12" cy="20" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Air Conditioning',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="6" rx="1" />
        <path d="M7 8h10" />
        <path d="M8 13c0 2 2 2 2 4s-2 2-2 4" />
        <path d="M12 13c0 2 2 2 2 4s-2 2-2 4" />
        <path d="M16 13c0 2 2 2 2 4s-2 2-2 4" />
      </svg>
    ),
  },
  {
    label: 'Flat-Screen TV',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4.5" width="18" height="12" rx="1.2" />
        <path d="M9 20h6M12 16.5V20" />
      </svg>
    ),
  },
  {
    label: 'Mini Bar',
    icon: (
      <svg {...iconProps}>
        <path d="M6 3h12l-1.5 8a4.5 4.5 0 0 1-9 0L6 3Z" />
        <path d="M12 12.5V21M8.5 21h7" />
      </svg>
    ),
  },
  {
    label: 'In-Room Safe',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="1.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9.5V12l1.5 1" />
      </svg>
    ),
  },
  {
    label: 'Rain Shower',
    icon: (
      <svg {...iconProps}>
        <path d="M6 9h12M8 9V6a4 4 0 0 1 8 0v3" />
        <path d="M8 13v.01M12 13v.01M16 13v.01M8 17v.01M12 17v.01M16 17v.01" />
      </svg>
    ),
  },
  {
    label: 'Daily Housekeeping',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v6" />
        <path d="M8 6a4 4 0 0 1 8 0" />
        <path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" />
      </svg>
    ),
  },
  {
    label: '24-Hour Room Service',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
]

const defaultBookingData = (): BookingData => {
  const today = startOfDay(new Date())
  return {
    dates: { checkIn: addDays(today, 1), checkOut: addDays(today, 2) },
    guests: { rooms: 1, adults: 2, children: 0 },
    specialCode: '',
  }
}

const DetailsPage: React.FC = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { rooms, loading, error } = useRoomsCatalog()

  const room = useMemo(() => rooms.find((r) => r.id === id) ?? rooms[0], [id, rooms])
  const otherRooms = useMemo(
    () => rooms.filter((r) => r.id !== room?.id).slice(0, 3),
    [rooms, room],
  )

  const bookingData = useMemo(
    () => decodeBookingQuery(searchParams, defaultBookingData()),
    [searchParams]
  )

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <p className="p-16 text-center font-classy text-gray-500">Loading room…</p>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <p className="p-16 text-center font-classy text-red-600">
          {error ? `Failed to load room: ${error}` : 'Room not found.'}
        </p>
      </div>
    )
  }

  const nights = getDaysBetween(bookingData.dates.checkIn, bookingData.dates.checkOut)
  const subtotal = room.priceValue * bookingData.guests.rooms * nights
  const taxesAndFees = Math.round(subtotal * 0.12)
  const total = subtotal + taxesAndFees
  const currency = (value: number) => `₱${value.toLocaleString('en-PH')}`

  const handleSearch = (data: BookingData) => {
    navigate(`/details/${room.id}?${encodeBookingQuery(data)}`)
  }

  const bookLink = `/payments?room=${room.id}&${encodeBookingQuery(bookingData)}`

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[380px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden">
        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 pb-12 sm:pb-16">
          <Link
            to="/search"
            className="group inline-flex items-center gap-2 font-classy text-xs tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors mb-6 w-fit"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Rooms
          </Link>
          <p className="font-classy text-xs tracking-[0.35em] text-cream uppercase mb-2">
            {room.category}
          </p>
          <h1 className="font-classy text-white text-4xl sm:text-6xl tracking-wider">
            {room.name}
          </h1>
        </div>
      </section>

      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-16 items-start">
          {/* Left: room info */}
          <div>
            <div className="flex flex-wrap items-center gap-3 pb-6 mb-6 border-b border-gray-200 font-classy text-sm text-gray-700">
              <span>{room.size}</span>
              <span className="text-gray-300">•</span>
              <span>{room.beds}</span>
              <span className="text-gray-300">•</span>
              <span>Sleeps {room.maxGuests}</span>
              <span className="text-gray-300">•</span>
              <span className="text-coffee font-semibold">{room.price} / night</span>
            </div>

            <h2 className="font-classy text-2xl text-gray-900 mb-4">About This Room</h2>
            <p className="font-classy text-sm text-gray-600 leading-relaxed max-w-2xl">
              {room.description}. Thoughtfully designed with a calm, contemporary interior, this room
              offers a restful retreat after a day of island adventures, with considered details and
              warm Filipino hospitality throughout your stay.
            </p>

            <h2 className="font-classy text-2xl text-gray-900 mt-12 mb-6">Room Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
              {ROOM_AMENITIES.map((amenity) => (
                <div key={amenity.label} className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 shrink-0 rounded-full border border-coffee/30 flex items-center justify-center text-coffee">
                    <div className="w-5 h-5">{amenity.icon}</div>
                  </div>
                  <p className="font-classy text-xs uppercase tracking-wide text-gray-700">
                    {amenity.label}
                  </p>
                </div>
              ))}
            </div>

            {otherRooms.length > 0 && (
              <>
                <h2 className="font-classy text-2xl text-gray-900 mt-14 mb-6">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {otherRooms.map((r) => (
                    <Link key={r.id} to={`/details/${r.id}`} className="group block">
                      <div className="relative h-40 overflow-hidden mb-3">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-classy text-base text-gray-900 group-hover:text-coffee transition-colors">
                        {r.name}
                      </h3>
                      <p className="font-classy text-sm text-coffee">{r.price}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: sticky booking card */}
          <aside className="lg:sticky lg:top-28 border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-classy text-2xl text-coffee font-semibold">{room.price}</span>
                <span className="font-classy text-xs text-gray-400">/ night</span>
              </div>
              <p className="font-classy text-xs text-gray-400 mb-6">Excluding taxes and fees</p>

              <div className="border border-gray-200 divide-y divide-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-coffee/5 transition-colors"
                >
                  <div>
                    <div className="font-balmoon text-[11px] tracking-widest text-gray-400 mb-0.5">
                      CHECK-IN
                    </div>
                    <div className="font-classy text-sm text-gray-900">
                      {formatDateWithWeekday(bookingData.dates.checkIn)}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-coffee/5 transition-colors"
                >
                  <div>
                    <div className="font-balmoon text-[11px] tracking-widest text-gray-400 mb-0.5">
                      CHECK-OUT
                    </div>
                    <div className="font-classy text-sm text-gray-900">
                      {formatDateWithWeekday(bookingData.dates.checkOut)}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-coffee/5 transition-colors"
                >
                  <div>
                    <div className="font-balmoon text-[11px] tracking-widest text-gray-400 mb-0.5">
                      GUESTS
                    </div>
                    <div className="font-classy text-sm text-gray-900">
                      {bookingData.guests.rooms} Room • {bookingData.guests.adults} Adults
                      {bookingData.guests.children > 0 ? ` • ${bookingData.guests.children} Children` : ''}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 font-classy text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>
                    {nights} night{nights !== 1 ? 's' : ''} x {bookingData.guests.rooms} room
                    {bookingData.guests.rooms !== 1 ? 's' : ''}
                  </span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes &amp; fees</span>
                  <span>{currency(taxesAndFees)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="font-classy text-base text-gray-900">Total</span>
                <span className="font-classy text-xl text-coffee font-semibold">{currency(total)}</span>
              </div>

              <Link
                to={bookLink}
                className="mt-6 w-full block text-center bg-coffee text-white font-classy tracking-[0.2em] uppercase text-xs py-4 hover:bg-coffee-light transition-colors"
              >
                Reserve Now
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      <BookingCalendarModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingData}
        onSearch={handleSearch}
      />
    </div>
  )
}

export default DetailsPage
