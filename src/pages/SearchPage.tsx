import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import BookingCalendarModal from '@/components/booking/BookingCalendarModal'
import { ROOMS, FILTERS, Category, AmenityLabel } from '@/data/rooms'
import { BookingData } from '@/types'
import { addDays, formatDateWithWeekday, getDaysBetween, startOfDay } from '@/utils/dateHelpers'
import { decodeBookingQuery, encodeBookingQuery } from '@/utils/bookingQuery'

const HERO_IMAGE = '/image/listpic.jpg'

const amenityIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const AMENITY_ICONS: Record<AmenityLabel, React.ReactNode> = {
  'Free WiFi': (
    <svg {...amenityIconProps}>
      <path d="M2.5 9.5a14 14 0 0 1 19 0" />
      <path d="M5.8 13.2a9.5 9.5 0 0 1 12.4 0" />
      <path d="M9 16.8a5 5 0 0 1 6 0" />
      <circle cx="12" cy="20" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  'Air Conditioning': (
    <svg {...amenityIconProps}>
      <rect x="4" y="5" width="16" height="6" rx="1" />
      <path d="M7 8h10" />
      <path d="M8 13c0 2 2 2 2 4s-2 2-2 4" />
      <path d="M16 13c0 2 2 2 2 4s-2 2-2 4" />
    </svg>
  ),
  'Flat-Screen TV': (
    <svg {...amenityIconProps}>
      <rect x="3" y="4.5" width="18" height="12" rx="1.2" />
      <path d="M9 20h6M12 16.5V20" />
    </svg>
  ),
  'Mini Bar': (
    <svg {...amenityIconProps}>
      <path d="M6 3h12l-1.5 8a4.5 4.5 0 0 1-9 0L6 3Z" />
      <path d="M12 12.5V21M8.5 21h7" />
    </svg>
  ),
  'City View': (
    <svg {...amenityIconProps}>
      <path d="M3 21V9l4-3 4 3v12M11 21V4l4-2 4 2v17" />
      <path d="M3 21h18" />
    </svg>
  ),
  'Garden View': (
    <svg {...amenityIconProps}>
      <path d="M12 21V11" />
      <path d="M12 11C9 11 7 9 7 6c3 0 5 2 5 5Z" />
      <path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5Z" />
      <path d="M6 21h12" />
    </svg>
  ),
  'Ocean View': (
    <svg {...amenityIconProps}>
      <circle cx="17" cy="7" r="2.2" />
      <path d="M3 13l4-4 4 3 5-5 5 5" />
      <path d="M3 18c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0 2.8 1.2 4.2 0" />
    </svg>
  ),
  'Private Balcony': (
    <svg {...amenityIconProps}>
      <path d="M4 21V9l8-6 8 6v12" />
      <path d="M4 14h16M9 21v-7M15 21v-7" />
    </svg>
  ),
  'Bathtub': (
    <svg {...amenityIconProps}>
      <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2Z" />
      <path d="M5 12V7a2 2 0 0 1 3.5-1.3" />
      <path d="M5 21v1M19 21v1" />
    </svg>
  ),
  'Living Area': (
    <svg {...amenityIconProps}>
      <path d="M4 18v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" />
      <path d="M3 18h18v2H3z" />
      <path d="M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
    </svg>
  ),
  'Connecting Rooms': (
    <svg {...amenityIconProps}>
      <rect x="2.5" y="5" width="8" height="14" rx="1" />
      <rect x="13.5" y="5" width="8" height="14" rx="1" />
      <path d="M10.5 12h3M12 10.5v3" />
    </svg>
  ),
}

const benefitIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const BOOKING_BENEFITS = [
  {
    title: 'Flexible Check-in & Check-out',
    description: 'Enjoy relaxed arrival and departure times whenever available.',
    icon: (
      <svg {...benefitIconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
  {
    title: 'Flexible Reservations',
    description: 'Modify or cancel your reservation with ease, directly with our team.',
    icon: (
      <svg {...benefitIconProps}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="1.5" />
        <path d="M3.5 9.5h17" />
        <path d="M8 3v3M16 3v3" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Exclusive Offers & Rates',
    description: 'Access to our best available prices and curated packages.',
    icon: (
      <svg {...benefitIconProps}>
        <path d="M12.5 3.5l7 7a2 2 0 010 2.8l-6.4 6.4a2 2 0 01-2.8 0l-7-7v-6.7a2.5 2.5 0 012.5-2.5h6.7z" />
        <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Concierge Assistance',
    description: 'Our team is on hand to help plan every part of your stay.',
    icon: (
      <svg {...benefitIconProps}>
        <path d="M4 19v-1a6 6 0 0112 0v1" />
        <circle cx="10" cy="8" r="3.5" />
        <path d="M16.5 5.5c1.4.3 2.5 1.6 2.5 3s-1.1 2.7-2.5 3" />
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

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const bookingData = useMemo(
    () => decodeBookingQuery(searchParams, defaultBookingData()),
    [searchParams]
  )
  const highlightedRoomId = searchParams.get('room') ? Number(searchParams.get('room')) : null

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>(() => {
    // Auto-set filter based on highlighted room's category
    if (highlightedRoomId) {
      const room = ROOMS.find(r => r.id === highlightedRoomId)
      if (room) return room.category
    }
    return 'All'
  })

  const nights = getDaysBetween(bookingData.dates.checkIn, bookingData.dates.checkOut)
  const totalGuests = bookingData.guests.adults + bookingData.guests.children

  const filteredRooms =
    activeFilter === 'All' ? ROOMS : ROOMS.filter((r) => r.category === (activeFilter as Category))

  // Scroll to highlighted room on mount
  useEffect(() => {
    if (highlightedRoomId) {
      setTimeout(() => {
        const element = document.getElementById(`room-${highlightedRoomId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }, [highlightedRoomId])

  const handleSearch = (data: BookingData) => {
    navigate(`/search?${encodeBookingQuery(data)}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Wide horizontal hero image */}
      <section className="relative h-[280px] sm:h-[380px] lg:h-[440px] w-full overflow-hidden">
        <img src={HERO_IMAGE} alt="Hotel view" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 sm:px-10 pb-16 sm:pb-20">
          <p className="font-classy text-xs tracking-[0.35em] text-cream uppercase mb-2">
            Select Room
          </p>
          <h1 className="font-classy text-white text-3xl sm:text-5xl tracking-wider">
            Available Rooms
          </h1>
        </div>
      </section>

      {/* Booking summary bar, overlapping hero */}
      <div className="relative -mt-10 z-10 mx-auto max-w-6xl px-4">
        <div className="bg-white shadow-xl rounded-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_200px] items-stretch">
            <div className="flex flex-col justify-center px-6 sm:px-8 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
              <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
                GUESTS
              </label>
              <div className="font-classy text-[15px] font-semibold text-gray-900">
                {bookingData.guests.rooms} Room • {bookingData.guests.adults} Adults
                {bookingData.guests.children > 0 ? ` • ${bookingData.guests.children} Children` : ''}
              </div>
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-8 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
              <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
                CHECK-IN
              </label>
              <div className="font-classy text-[15px] font-semibold text-gray-900">
                {formatDateWithWeekday(bookingData.dates.checkIn)}
              </div>
            </div>

            <div className="flex flex-col justify-center px-6 sm:px-8 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
              <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
                CHECK-OUT
              </label>
              <div className="font-classy text-[15px] font-semibold text-gray-900">
                {formatDateWithWeekday(bookingData.dates.checkOut)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-coffee hover:bg-coffee-light text-white font-classy uppercase tracking-[0.2em] text-xs py-4"
            >
              Modify Search
            </button>
          </div>
        </div>
      </div>

      {/* Room list */}
      <section className="px-4 pt-14 pb-20">
        <div className="max-w-7xl mx-auto">
          <p className="font-classy text-xs tracking-[0.35em] text-coffee uppercase mb-2">
            {nights} Night{nights !== 1 ? 's' : ''} · {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
          </p>
          <h2 className="font-classy text-3xl sm:text-4xl text-gray-900 tracking-wider mb-4">
            Select Room
          </h2>
          <div className="w-14 h-px bg-coffee mb-8" />

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-10 pb-6 border-b border-gray-200">
            <span className="font-classy text-xs tracking-[0.2em] text-gray-400 uppercase">
              Filter By
            </span>
            {FILTERS.map((filter, i) => (
              <React.Fragment key={filter}>
                {i > 0 && <span className="hidden sm:block w-px h-4 bg-gray-300" />}
                <button
                  onClick={() => setActiveFilter(filter)}
                  className={`font-classy italic text-sm md:text-base transition-colors ${
                    activeFilter === filter
                      ? 'text-gray-900 underline underline-offset-8 decoration-coffee'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {filter}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 xl:gap-16">
            {/* Rooms */}
            <div>
              {filteredRooms.map((room) => {
                const isAvailable = room.maxGuests >= totalGuests
                const isHighlighted = room.id === highlightedRoomId
                const detailsLink = `/details/${room.id}?${encodeBookingQuery(bookingData)}`
                const bookLink = `/payments?room=${room.id}&${encodeBookingQuery(bookingData)}`

                return (
                  <div
                    id={`room-${room.id}`}
                    key={room.id}
                    className={`pb-10 mb-10 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0 ${
                      isHighlighted ? 'ring-1 ring-coffee/40 -mx-4 px-4 pt-4' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-full sm:w-[300px] h-[220px] shrink-0 overflow-hidden bg-gray-100">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-classy text-2xl text-gray-900 mb-1">{room.name}</h3>
                        <p className="font-classy text-sm text-gray-600 mb-3">{room.beds}</p>

                        <div className="flex flex-wrap items-center gap-2 text-sm font-classy mb-4">
                          <span className={isAvailable ? 'text-coffee font-medium' : 'text-gray-400 font-medium'}>
                            {isAvailable ? 'Available' : 'Not enough capacity'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600">{room.beds}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600">Sleeps {room.maxGuests}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600">{room.size}</span>
                        </div>

                        <p className="font-classy text-sm text-gray-600 leading-relaxed mb-4 max-w-2xl">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap gap-x-5 gap-y-3 mb-5">
                          {room.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2">
                              <div className="w-7 h-7 shrink-0 rounded-full border border-coffee/30 flex items-center justify-center text-coffee">
                                <div className="w-3.5 h-3.5">{AMENITY_ICONS[amenity]}</div>
                              </div>
                              <span className="font-classy text-xs text-gray-600">{amenity}</span>
                            </div>
                          ))}
                        </div>

                        <Link
                          to={detailsLink}
                          className="group inline-flex items-center gap-2 font-classy tracking-[0.2em] uppercase text-xs text-coffee"
                        >
                          Room Details
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div>
                        <ul className="space-y-1.5 font-classy text-sm text-gray-600 list-disc list-inside">
                          <li>Our best available room rate</li>
                          <li>Flexible early check-in and late departure</li>
                          <li>Free cancellation and modification</li>
                        </ul>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-classy text-2xl text-gray-900 mb-0.5">{room.price}</div>
                        <div className="font-classy text-xs text-gray-400">Average Per Night</div>
                        <div className="font-classy text-xs text-gray-400 mb-4">Excluding taxes and fees</div>
                        <Link
                          to={bookLink}
                          className={`inline-block px-8 py-3 font-classy text-xs tracking-[0.2em] uppercase transition-colors ${
                            isAvailable
                              ? 'bg-coffee text-white hover:bg-coffee-light'
                              : 'bg-gray-200 text-gray-400 pointer-events-none'
                          }`}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sidebar */}
            <aside className="lg:pt-1">
              <h3 className="font-classy text-lg text-gray-900 mb-6">
                Book Direct for Exclusive Benefits
              </h3>
              <div className="divide-y divide-gray-100">
                {BOOKING_BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4 py-4 first:pt-0">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-coffee/30 text-coffee">
                      <div className="w-5 h-5">{benefit.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-classy text-sm text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="font-classy text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h4 className="font-classy text-lg text-gray-900 mb-3">Need Assistance?</h4>
                <p className="font-classy text-sm text-gray-500 mb-4">
                  Our dedicated reservations team is available:
                </p>
                <a href="tel:+000000000" className="block font-classy text-sm text-coffee mb-1 hover:opacity-70 transition-opacity">
                  +000000000
                </a>
                <a href="mailto:DelightfulPH@brigada.com" className="block font-classy text-sm text-coffee hover:opacity-70 transition-opacity">
                  DelightfulPH@brigada.com
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

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

export default SearchPage
