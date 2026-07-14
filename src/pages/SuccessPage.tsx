import React, { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { ROOMS } from '@/data/rooms'

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = Number(searchParams.get('room')) || ROOMS[0].id
  const room = useMemo(() => ROOMS.find((r) => r.id === roomId) ?? ROOMS[0], [roomId])
  const confirmationCode = useMemo(
    () => `DPH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    []
  )

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation forceScrolled />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-32">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-coffee/30 flex items-center justify-center text-coffee">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="font-classy text-xs tracking-[0.35em] text-coffee uppercase mb-2">
            Booking Confirmed
          </p>
          <h1 className="font-classy text-3xl sm:text-4xl text-gray-900 tracking-wider mb-4">
            Thank You for Your Reservation
          </h1>
          <p className="font-classy text-sm text-gray-600 leading-relaxed mb-8">
            Your stay in the <span className="text-coffee font-medium">{room.name}</span> is booked. A
            confirmation email with your itinerary has been sent to you.
          </p>

          <div className="border border-gray-200 px-6 py-4 mb-10 inline-block">
            <p className="font-classy text-[11px] tracking-widest text-gray-400 uppercase mb-1">
              Confirmation Number
            </p>
            <p className="font-classy text-lg text-gray-900">{confirmationCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-16">
            <Link
              to="/"
              className="font-classy tracking-[0.2em] uppercase text-xs text-coffee border border-coffee px-8 py-3 hover:bg-coffee hover:text-white transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/search"
              className="font-classy tracking-[0.2em] uppercase text-xs text-white bg-coffee px-8 py-3 hover:bg-coffee-light transition-colors"
            >
              Book Another Stay
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SuccessPage
