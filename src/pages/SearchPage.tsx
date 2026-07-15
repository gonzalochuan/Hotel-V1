import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import BookingCalendarModal from '@/components/booking/BookingCalendarModal'
import { useRoomsCatalog } from '@/context/RoomsCatalogContext'
import { checkRoomAvailability } from '@/services/bookingsApi'
import { resolveIcon } from '@/data/icons'
import { BookingData } from '@/types'
import { addDays, formatDateWithWeekday, getDaysBetween, startOfDay } from '@/utils/dateHelpers'
import { decodeBookingQuery, encodeBookingQuery } from '@/utils/bookingQuery'

const HERO_IMAGE = '/image/listpic.jpg'
const FILTERS_ALL = 'All'

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
  const { rooms, categories, loading, error } = useRoomsCatalog()

  const bookingData = useMemo(
    () => decodeBookingQuery(searchParams, defaultBookingData()),
    [searchParams]
  )
  const highlightedRoomId = searchParams.get('room')

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>(FILTERS_ALL)
  const [dateAvailability, setDateAvailability] = useState<Record<string, boolean>>({})

  const checkInStr = bookingData.dates.checkIn.toISOString().slice(0, 10)
  const checkOutStr = bookingData.dates.checkOut.toISOString().slice(0, 10)

  useEffect(() => {
    if (rooms.length === 0) return
    let cancelled = false
    Promise.all(
      rooms.map(async (room) => {
        const available = await checkRoomAvailability(room.id, checkInStr, checkOutStr).catch(() => true)
        return [room.id, available] as const
      }),
    ).then((entries) => {
      if (!cancelled) setDateAvailability(Object.fromEntries(entries))
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, checkInStr, checkOutStr])

  // Auto-set filter based on highlighted room's category once rooms load
  useEffect(() => {
    if (!highlightedRoomId) return
    const room = rooms.find((r) => r.id === highlightedRoomId)
    if (room) setActiveFilter(room.category)
  }, [highlightedRoomId, rooms])

  const nights = getDaysBetween(bookingData.dates.checkIn, bookingData.dates.checkOut)
  const totalGuests = bookingData.guests.adults + bookingData.guests.children

  const filters = [FILTERS_ALL, ...categories]
  const filteredRooms = activeFilter === FILTERS_ALL ? rooms : rooms.filter((r) => r.category === activeFilter)

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
            {filters.map((filter, i) => (
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
              {loading ? <p className="font-classy text-sm text-gray-500">Loading rooms…</p> : null}
              {error ? <p className="font-classy text-sm text-red-600">Failed to load rooms: {error}</p> : null}
              {filteredRooms.map((room) => {
                const hasCapacity = room.maxGuests >= totalGuests
                const isDateAvailable = dateAvailability[room.id] !== false
                const isAvailable = hasCapacity && isDateAvailable
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
                        {room.discountPercent > 0 ? (
                          <span className="absolute left-3 top-3 bg-coffee text-white font-classy text-[10px] tracking-widest uppercase px-3 py-1">
                            {room.discountPercent}% Off
                          </span>
                        ) : null}
                        {!isDateAvailable ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="border border-white/50 text-white font-classy text-xs tracking-[0.2em] uppercase px-4 py-2">
                              Not Available
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-classy text-2xl text-gray-900 mb-1">{room.name}</h3>
                        <p className="font-classy text-sm text-gray-600 mb-3">{room.beds}</p>

                        <div className="flex flex-wrap items-center gap-2 text-sm font-classy mb-4">
                          <span className={isAvailable ? 'text-coffee font-medium' : 'text-gray-400 font-medium'}>
                            {!isDateAvailable ? 'No available room for these dates' : !hasCapacity ? 'Not enough capacity' : 'Available'}
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
                          {room.amenities.map((amenity) => {
                            const AmenityIcon = resolveIcon(amenity.icon)
                            return (
                              <div key={amenity.label} className="flex items-center gap-2">
                                <div className="w-7 h-7 shrink-0 rounded-full border border-coffee/30 flex items-center justify-center text-coffee">
                                  <AmenityIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </div>
                                <span className="font-classy text-xs text-gray-600">{amenity.label}</span>
                              </div>
                            )
                          })}
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
                        {room.discountPercent > 0 ? (
                          <div className="font-classy text-sm text-gray-400 line-through">
                            ₱{room.basePriceValue.toLocaleString('en-PH')}
                          </div>
                        ) : null}
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
                          {isAvailable ? 'Book Now' : 'Unavailable'}
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
