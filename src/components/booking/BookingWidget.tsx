import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/dateHelpers'
import { BookingData } from '@/types'
import { encodeBookingQuery } from '@/utils/bookingQuery'
import BookingCalendarModal from './BookingCalendarModal'

const BookingWidget: React.FC = () => {
  const navigate = useNavigate()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    dates: {
      checkIn: new Date('2026-07-08'),
      checkOut: new Date('2026-07-09')
    },
    guests: {
      rooms: 1,
      adults: 2,
      children: 0
    },
    specialCode: ''
  })

  const handleSearch = (data: BookingData) => {
    setBookingData(data)
    navigate(`/search?${encodeBookingQuery(data)}`)
  }

  return (
  <div className="relative -mt-32 z-10 mx-auto max-w-5xl px-4">
    <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-sm overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_180px] items-stretch">

        {/* Dates */}
        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="flex flex-col justify-center px-6 py-3 border-r border-gray-200 text-left hover:bg-coffee/5 transition-colors"
        >
          <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
            DATES
          </label>

          <div className="font-classy text-[14px] font-normal text-gray-900">
            {formatDate(bookingData.dates.checkIn)} –{" "}
            {formatDate(bookingData.dates.checkOut)}
          </div>
        </button>

        {/* Guests */}
        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="flex flex-col justify-center px-6 py-3 border-r border-gray-200 text-left hover:bg-coffee/5 transition-colors"
        >
          <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
            GUESTS
          </label>

          <div className="font-classy text-[14px] font-normal text-gray-900">
            {bookingData.guests.rooms} Room • {bookingData.guests.adults} Adults
          </div>
        </button>

        {/* Special Codes */}
        <div className="flex flex-col justify-center px-6 py-3 border-r border-gray-200">
          <label className="font-balmoon text-[12px] tracking-widest text-coffee mb-1">
            SPECIAL CODES
          </label>

          <input
            type="text"
            placeholder="Add Code"
            value={bookingData.specialCode}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                specialCode: e.target.value,
              })
            }
            className="font-classy text-[14px] font-normal text-gray-900 border-b border-coffee/30 focus:border-coffee outline-none bg-transparent placeholder-gray-400 pb-1"
          />
        </div>

        {/* Reserve Button */}
        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="w-full bg-coffee hover:bg-coffee-light text-white font-classy uppercase tracking-[0.2em] text-xs py-3"
        >
          RESERVE
        </button>

      </div>
    </div>

    <BookingCalendarModal
      isOpen={isBookingOpen}
      onClose={() => setIsBookingOpen(false)}
      initialData={bookingData}
      onSearch={handleSearch}
    />
  </div>
);
}

export default BookingWidget
