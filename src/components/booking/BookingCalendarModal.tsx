import React, { useEffect, useState } from 'react'
import { BookingData } from '@/types'
import {
  formatDateWithWeekday,
  formatMonthYear,
  getMonthGrid,
  isSameDay,
  startOfDay,
  WEEKDAY_LABELS,
} from '@/utils/dateHelpers'

interface BookingCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: BookingData
  onSearch: (data: BookingData) => void
}

const BookingCalendarModal: React.FC<BookingCalendarModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSearch,
}) => {
  const today = startOfDay(new Date())

  const [checkIn, setCheckIn] = useState<Date | null>(initialData.dates.checkIn)
  const [checkOut, setCheckOut] = useState<Date | null>(initialData.dates.checkOut)
  const [guests, setGuests] = useState(initialData.guests)
  const [specialCode, setSpecialCode] = useState(initialData.specialCode || '')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [showGuestsPanel, setShowGuestsPanel] = useState(false)
  const [activeField, setActiveField] = useState<'checkin' | 'checkout'>('checkin')
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCheckIn(initialData.dates.checkIn)
      setCheckOut(initialData.dates.checkOut)
      setGuests(initialData.guests)
      setSpecialCode(initialData.specialCode || '')
      setMonthOffset(0)
      setShowGuestsPanel(false)
      setActiveField('checkin')
      // lock background scroll while open
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const baseMonthIndex = today.getFullYear() * 12 + today.getMonth() + monthOffset
  const monthsToShow = [baseMonthIndex, baseMonthIndex + 1].map((idx) => ({
    year: Math.floor(idx / 12),
    month: idx % 12,
  }))

  const handleDayClick = (date: Date) => {
    if (date < today) return

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut(null)
      setActiveField('checkout')
    } else if (date <= checkIn) {
      setCheckIn(date)
      setCheckOut(null)
      setActiveField('checkout')
    } else {
      setCheckOut(date)
      setActiveField('checkin')
    }
  }

  const isInSelectedRange = (date: Date) =>
    checkIn && checkOut && date > checkIn && date < checkOut

  const isInHoverPreview = (date: Date) =>
    checkIn && !checkOut && hoverDate && date > checkIn && date < hoverDate

  const updateGuests = (key: 'rooms' | 'adults' | 'children', delta: number) => {
    setGuests((prev) => {
      const min = key === 'adults' ? 1 : key === 'rooms' ? 1 : 0
      const next = Math.max(min, prev[key] + delta)
      return { ...prev, [key]: next }
    })
  }

  const canSearch = Boolean(checkIn && checkOut)

  const handleSearch = () => {
    if (!checkIn || !checkOut) return
    onSearch({
      dates: { checkIn, checkOut },
      guests,
      specialCode,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white shadow-2xl rounded-sm max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-coffee transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 sm:px-10 pt-8">
          {/* Field row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-200">
            <div className="relative py-4 sm:pr-6 border-b sm:border-b-0 sm:border-r border-gray-200">
              <button
                type="button"
                onClick={() => setShowGuestsPanel((s) => !s)}
                className="w-full text-left"
              >
                <div className="font-balmoon text-[12px] tracking-widest text-gray-400 mb-1">
                  GUESTS
                </div>
                <div className="flex items-center justify-between font-classy text-[15px] text-gray-900">
                  <span>
                    {guests.adults} adult{guests.adults !== 1 ? 's' : ''}, {guests.children} child{guests.children !== 1 ? 'ren' : ''}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-coffee transition-transform ${showGuestsPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {showGuestsPanel && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-sm p-5 z-10">
                  {(['rooms', 'adults', 'children'] as const).map((key) => (
                    <div key={key} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <span className="font-classy text-sm text-gray-700 capitalize">{key}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateGuests(key, -1)}
                          className="w-7 h-7 flex items-center justify-center border border-coffee/40 text-coffee hover:bg-coffee hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-classy text-sm">{guests[key]}</span>
                        <button
                          type="button"
                          onClick={() => updateGuests(key, 1)}
                          className="w-7 h-7 flex items-center justify-center border border-coffee/40 text-coffee hover:bg-coffee hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowGuestsPanel(false)}
                    className="mt-3 w-full bg-coffee text-white font-classy text-xs tracking-widest uppercase py-2"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveField('checkin')}
              className={`text-left py-4 sm:px-6 border-b sm:border-b-0 sm:border-r border-gray-200 ${activeField === 'checkin' ? 'bg-coffee/5' : ''}`}
            >
              <div className="font-balmoon text-[12px] tracking-widest text-gray-400 mb-1">
                CHECK IN
              </div>
              <div className="flex items-center justify-between font-classy text-[15px] text-gray-900">
                <span>{checkIn ? formatDateWithWeekday(checkIn) : 'Select date'}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveField('checkout')}
              className={`text-left py-4 sm:pl-6 ${activeField === 'checkout' ? 'bg-coffee/5' : ''}`}
            >
              <div className="font-balmoon text-[12px] tracking-widest text-gray-400 mb-1">
                CHECK OUT
              </div>
              <div className="flex items-center justify-between font-classy text-[15px] text-gray-900">
                <span>{checkOut ? formatDateWithWeekday(checkOut) : 'Select date'}</span>
              </div>
            </button>
          </div>

          {/* Special codes */}
          <div className="flex justify-end py-3">
            <button
              type="button"
              onClick={() => setShowCodeInput((s) => !s)}
              className="font-balmoon text-[12px] tracking-widest text-coffee flex items-center gap-1"
            >
              SPECIAL CODES OR RATES
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showCodeInput ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {showCodeInput && (
            <div className="flex justify-end pb-3">
              <input
                type="text"
                placeholder="Add Code"
                value={specialCode}
                onChange={(e) => setSpecialCode(e.target.value)}
                className="font-classy text-sm border-b border-coffee/30 focus:border-coffee outline-none bg-transparent placeholder-gray-400 pb-1 w-56"
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200" />

        {/* Calendar */}
        <div className="px-6 sm:px-10 py-8">
          <div className="flex items-start justify-between gap-8">
            <button
              type="button"
              onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
              disabled={monthOffset === 0}
              aria-label="Previous month"
              className={`mt-1 shrink-0 ${monthOffset === 0 ? 'text-gray-200 cursor-default' : 'text-coffee hover:text-coffee-light'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10">
              {monthsToShow.map(({ year, month }) => {
                const cells = getMonthGrid(year, month)
                return (
                  <div key={`${year}-${month}`}>
                    <div className="text-center font-classy text-lg text-gray-900 mb-4">
                      {formatMonthYear(year, month)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                      {WEEKDAY_LABELS.map((label, i) => (
                        <div key={i} className="font-balmoon text-[11px] text-gray-400 py-2">
                          {label}
                        </div>
                      ))}
                      {cells.map((date, i) => {
                        if (!date) return <div key={i} />

                        const disabled = date < today
                        const isCheckIn = checkIn ? isSameDay(date, checkIn) : false
                        const isCheckOut = checkOut ? isSameDay(date, checkOut) : false
                        const inRange = isInSelectedRange(date)
                        const inHover = isInHoverPreview(date)
                        const selected = isCheckIn || isCheckOut || inRange

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDayClick(date)}
                            onMouseEnter={() => setHoverDate(date)}
                            onMouseLeave={() => setHoverDate(null)}
                            className={`h-9 text-sm font-classy transition-colors ${
                              disabled
                                ? 'text-gray-300 cursor-default'
                                : selected
                                ? 'bg-coffee text-white'
                                : inHover
                                ? 'bg-coffee/10 text-gray-900'
                                : 'text-gray-800 hover:bg-coffee/10'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setMonthOffset((m) => m + 1)}
              aria-label="Next month"
              className="mt-1 shrink-0 text-coffee hover:text-coffee-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-t border-gray-200">
          <div className="hidden sm:flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border border-gray-300" style={{ background: 'linear-gradient(to top right, transparent 48%, #d1d5db 48%, #d1d5db 52%, transparent 52%)' }} />
              <span className="font-classy text-xs">No Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border border-gray-300" style={{ background: 'linear-gradient(to bottom right, transparent 48%, #d1d5db 48%, #d1d5db 52%, transparent 52%)' }} />
              <span className="font-classy text-xs">No Check-out</span>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="font-classy tracking-[0.15em] uppercase text-xs text-coffee hover:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!canSearch}
              className={`px-8 py-3 font-classy tracking-[0.15em] uppercase text-xs text-white transition-colors ${
                canSearch ? 'bg-coffee hover:bg-coffee-light' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingCalendarModal
