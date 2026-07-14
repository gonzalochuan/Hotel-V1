import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROOMS, FILTERS } from '@/data/rooms'
import { BookingData } from '@/types'
import { addDays, startOfDay } from '@/utils/dateHelpers'
import { encodeBookingQuery } from '@/utils/bookingQuery'

const rooms = ROOMS

const RoomsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const [activeId, setActiveId] = useState(rooms[0].id)
  const thumbRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const filteredRooms = activeFilter === 'All' ? rooms : rooms.filter((r) => r.category === activeFilter)
  const activeRoom = filteredRooms.find((r) => r.id === activeId) ?? filteredRooms[0]

  useEffect(() => {
    if (filteredRooms.length && !filteredRooms.some((r) => r.id === activeId)) {
      setActiveId(filteredRooms[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  const scrollThumbs = (dir: 'left' | 'right') => {
    thumbRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' })
  }

  const handleCheckAvailability = (roomId: number) => {
    const today = startOfDay(new Date())
    const defaultData: BookingData = {
      dates: { checkIn: addDays(today, 1), checkOut: addDays(today, 2) },
      guests: { rooms: 1, adults: 2, children: 0 },
      specialCode: '',
    }
    navigate(`/search?${encodeBookingQuery(defaultData)}&room=${roomId}`)
  }

  if (!activeRoom) return null

  return (
    <section id="rooms" className="pt-8 pb-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <p className="font-classy text-xs tracking-[0.35em] text-coffee uppercase mb-2">
          Elegant
        </p>
        <h2 className="font-classy text-4xl md:text-5xl text-gray-900 tracking-wider mb-4">
          Accommodation
        </h2>
        <div className="w-14 h-px bg-coffee mb-8" />

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-10 md:mb-14">
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

        {/* Featured room */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] border border-gray-100">
          <div className="relative h-[280px] sm:h-[380px] lg:h-[460px] overflow-hidden bg-gray-100">
            <img
              key={activeRoom.id}
              src={activeRoom.image}
              alt={activeRoom.name}
              className="w-full h-full object-cover animate-[fadeIn_0.4s_ease]"
            />
          </div>

          <div className="bg-gray-50 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <h3 className="font-classy text-2xl font-medium text-gray-900 mb-4">
                {activeRoom.name}
              </h3>
              <p className="font-classy text-sm text-gray-600 leading-relaxed mb-5">
                {activeRoom.description}
              </p>
              <div className="flex gap-3 text-base font-classy mb-6">
                <span>{activeRoom.size}</span>
                <span>•</span>
                <span>{activeRoom.beds}</span>
                <span>•</span>
                <span className="text-coffee font-semibold">{activeRoom.price}</span>
              </div>
              <Link
                to={`/details/${activeRoom.id}`}
                className="group inline-flex items-center gap-2 font-classy tracking-[0.2em] uppercase text-xs"
              >
                View Room
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => handleCheckAvailability(activeRoom.id)}
              className="w-full bg-coffee text-white font-classy text-xs tracking-[0.25em] uppercase py-4 mt-10 hover:bg-coffee-light transition-colors"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center gap-3 md:gap-6 mt-8">
          <button
            onClick={() => scrollThumbs('left')}
            aria-label="Previous rooms"
            className="shrink-0 p-2 text-gray-400 hover:text-coffee transition-colors"
          >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#b1973cb6" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            ref={thumbRef}
            className="flex-1 flex gap-4 md:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveId(room.id)}
                className="group shrink-0 w-36 sm:w-44 md:w-48 text-left"
              >
                <div
                  className={`relative h-24 sm:h-28 md:h-32 overflow-hidden mb-2 transition-opacity ${
                    room.id === activeRoom.id ? '' : 'opacity-60 group-hover:opacity-100'
                  }`}
                >
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <p
                  className={`font-classy text-[10px] md:text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    room.id === activeRoom.id ? 'text-gray-900 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {room.name}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollThumbs('right')}
            aria-label="Next rooms"
            className="shrink-0 p-2 text-gray-400 hover:text-coffee transition-colors"
          >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#b1973cb6" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveId(room.id)}
              aria-label={`View ${room.name}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                room.id === activeRoom.id ? 'bg-coffee' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoomsSection
