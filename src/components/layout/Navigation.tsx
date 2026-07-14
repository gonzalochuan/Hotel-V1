import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HOTEL_NAME, NAVIGATION_ITEMS, MENU_LINKS } from '@/utils/constants'
import { BookingData } from '@/types'
import { addDays, startOfDay } from '@/utils/dateHelpers'
import { encodeBookingQuery } from '@/utils/bookingQuery'
import BookingCalendarModal from '@/components/booking/BookingCalendarModal'

const defaultBookingData = (): BookingData => {
  const today = startOfDay(new Date())
  return {
    dates: { checkIn: addDays(today, 1), checkOut: addDays(today, 2) },
    guests: { rooms: 1, adults: 2, children: 0 },
    specialCode: '',
  }
}

interface NavigationProps {
  forceScrolled?: boolean
}

const Navigation: React.FC<NavigationProps> = ({ forceScrolled = false }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleSearch = (data: BookingData) => {
    navigate(`/search?${encodeBookingQuery(data)}`)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 transition-colors duration-300 ${
      isScrolled || forceScrolled ? 'bg-white text-coffee' : 'text-white'
    }`}>
      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        className="font-upstair_sans text-xs sm:text-sm tracking-wider flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">MENU</span>
      </button>

      <div className="font-colbiac text-lg sm:text-2xl tracking-widest absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-3">
        <img src="/image/dphlogo.png" alt="DPH Logo" className="h-6 sm:h-8 w-auto" />
        <span className="hidden sm:inline">{HOTEL_NAME}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-6">
          {NAVIGATION_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-upstair_sans text-sm tracking-wider hover:opacity-80 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="font-upstair_sans text-xs sm:text-sm tracking-wider border border-current px-4 sm:px-6 py-2 hover:bg-coffee hover:text-white transition-colors"
        >
          RESERVE
        </button>
      </div>

      {/* Slide-out menu */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[380px] bg-white z-[95] shadow-2xl transition-transform duration-300 flex flex-col ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/image/dphlogo.png" alt="DPH Logo" className="h-8 w-auto" />
          </div>
          <span className="font-colbiac text-xl tracking-widest text-coffee">
            {HOTEL_NAME}
          </span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="text-coffee hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {MENU_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between py-4 border-b border-gray-100 font-classy text-2xl text-gray-800 hover:text-coffee transition-colors"
            >
              {link.label}
              <span className="text-gray-300">›</span>
            </a>
          ))}
        </div>

        <div className="px-8 py-6 border-t border-gray-100">
          <a
            href="/"
            className="flex items-center justify-between py-2 font-classy text-xs tracking-widest text-gray-500 hover:text-coffee transition-colors"
          >
            HOMEPAGE
            <span>›</span>
          </a>
          <a
            href="/search"
            className="flex items-center justify-between py-2 font-classy text-xs tracking-widest text-gray-500 hover:text-coffee transition-colors"
          >
            SEARCH ROOMS
            <span>›</span>
          </a>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-coffee">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-classy text-xs tracking-widest">ENGLISH</span>
          </div>
        </div>
      </div>

      <BookingCalendarModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={defaultBookingData()}
        onSearch={handleSearch}
      />
    </nav>
  )
}

export default Navigation
