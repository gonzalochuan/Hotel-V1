import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import { ROOMS } from '@/data/rooms'
import { BookingData } from '@/types'
import { addDays, formatDateWithWeekday, getDaysBetween, startOfDay } from '@/utils/dateHelpers'
import { decodeBookingQuery } from '@/utils/bookingQuery'

const HOTEL_ADDRESS = 'Corong-Corong Beach, El Nido, Palawan'
const HOTEL_RATING = 0
const HOTEL_REVIEWS = 0

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const HIGHLIGHTS = [
  {
    label: 'Swimming Pool',
    icon: (
      <svg {...iconProps}>
        <path d="M2.5 10.5c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0 2.8 1.2 4.2 0" />
        <path d="M2.5 15.5c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0 2.8 1.2 4.2 0" />
      </svg>
    ),
  },
  {
    label: 'Restaurant',
    icon: (
      <svg {...iconProps}>
        <path d="M7 2.5v7a1.6 1.6 0 0 0 3.2 0v-7" />
        <path d="M8.6 2.5v19" />
        <path d="M16.5 2.5c-1.7 0-2.3 2.3-2.3 4.6s.6 4.1 2.3 4.1" />
        <path d="M16.5 2.5v19" />
      </svg>
    ),
  },
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
        <path d="M16 13c0 2 2 2 2 4s-2 2-2 4" />
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

const PaymentsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showSpecialRequests, setShowSpecialRequests] = useState(false)
  const [showCancellationDetails, setShowCancellationDetails] = useState(false)
  const [couponVisible, setCouponVisible] = useState(false)

  const bookingData = useMemo(
    () => decodeBookingQuery(searchParams, defaultBookingData()),
    [searchParams]
  )
  const roomId = Number(searchParams.get('room')) || ROOMS[0].id
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0]

  const nights = getDaysBetween(bookingData.dates.checkIn, bookingData.dates.checkOut)
  const roomCount = bookingData.guests.rooms

  const subtotal = room.priceValue * roomCount * nights
  const taxesAndFees = Math.round(subtotal * 0.12)
  const total = subtotal + taxesAndFees

  const currency = (value: number) => `₱${value.toLocaleString('en-PH')}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/success?room=${room.id}`)
  }

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation forceScrolled />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-classy text-base text-coffee hover:opacity-70 transition-opacity mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Rooms
          </button>
          <p className="font-classy text-base tracking-[0.35em] text-coffee uppercase mb-2">
            Secure Checkout
          </p>
          <h1 className="font-classy text-3xl sm:text-4xl text-gray-900 tracking-wider mb-10">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-16 items-start">
            {/* Left: guest + payment form */}
            <form onSubmit={handleSubmit} className="min-w-0">
              <h2 className="font-classy text-2xl text-gray-900 mb-1">Who&apos;s Checking In?</h2>
              <p className="font-classy text-base text-gray-400 mb-8">* Required</p>

              {Array.from({ length: roomCount }).map((_, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-gray-100 last:border-0">
                  <h3 className="font-classy text-base tracking-widest text-coffee uppercase mb-4">
                    Room {i + 1}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-classy text-base text-gray-500 mb-1">
                        First name <span className="text-coffee">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John"
                        className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block font-classy text-base text-gray-500 mb-1">
                        Last name <span className="text-coffee">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smith"
                        className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                      />
                    </div>

                    {i === 0 && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block font-classy text-base text-gray-500 mb-1">
                            Email address <span className="text-coffee">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block font-classy text-base text-gray-500 mb-1">
                            Phone country/region
                          </label>
                          <select className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none bg-white">
                            <option>PHL +63</option>
                            <option>USA +1</option>
                            <option>JPN +81</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-classy text-base text-gray-500 mb-1">
                            Phone number <span className="text-coffee">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Phone number"
                            className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-start gap-2 mt-1">
                          <input type="checkbox" id="marketing" className="mt-1 accent-coffee" />
                          <label htmlFor="marketing" className="font-classy text-base text-gray-500 leading-relaxed">
                            Get emails about deals, offers, and other info from {room.name.split(' ')[0]} Stays. You can opt out anytime.
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <h2 id="payment-details" className="font-classy text-2xl text-gray-900 mb-4">Payment Details</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="border border-gray-300 p-1">
                  <img src="/image/visalogo.png" alt="VISA" className="h-6 w-auto" />
                </div>
                <div className="border border-gray-300 p-1">
                  <img src="/image/mastercardlogo.png" alt="MASTERCARD" className="h-6 w-auto" />
                </div>
                <div className="border border-gray-300 p-1">
                  <img src="/image/amexlogo.png" alt="AMEX" className="h-6 w-8" />
                </div>
                <div className="border border-gray-300 p-1">
                  <img src="/image/jcblogo.png" alt="JCB" className="h-6 w-8" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="sm:col-span-2">
                  <label className="block font-classy text-base text-gray-500 mb-1">
                    Name on card <span className="text-coffee">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-classy text-base text-gray-500 mb-1">
                    Card number <span className="text-coffee">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block font-classy text-base text-gray-500 mb-1">
                    Expiration date <span className="text-coffee">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block font-classy text-base text-gray-500 mb-1">
                    Security code <span className="text-coffee">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CVV"
                    className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block font-classy text-base text-gray-500 mb-1">
                    Billing ZIP code <span className="text-coffee">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 mb-6">
                <span className="inline-block font-classy text-[11px] tracking-widest uppercase bg-green-100 text-green-700 px-2 py-1 mb-3">
                  Free Cancellation
                </span>
                <p className="font-classy text-sm text-gray-600 leading-relaxed">
                  Cancel or modify this reservation free of charge up to 48 hours before check-in.
                  After that, the first night is non-refundable.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSpecialRequests((s) => !s)}
                className="w-full flex items-center justify-between py-4 border-t border-gray-200 font-classy text-sm text-gray-700"
              >
                Special check-in instructions
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-coffee transition-transform ${showSpecialRequests ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSpecialRequests && (
                <textarea
                  placeholder="Let us know if you have any special requests"
                  className="w-full border border-gray-300 px-4 py-3 text-base font-classy focus:border-coffee outline-none mb-2 placeholder-gray-400"
                  rows={3}
                />
              )}

              <button
                type="button"
                onClick={() => setShowCancellationDetails((s) => !s)}
                className="w-full flex items-center justify-between py-4 border-t border-gray-200 font-classy text-sm text-gray-700"
              >
                Taxes and fees
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-coffee transition-transform ${showCancellationDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCancellationDetails && (
                <p className="font-classy text-sm text-gray-500 leading-relaxed pb-4 border-b border-gray-200">
                  A 12% local tax and service charge is applied to the room rate and shown in the price
                  breakdown before you confirm payment.
                </p>
              )}

              <p className="font-classy text-base text-gray-400 leading-relaxed mt-6 mb-6">
                By clicking the button below, I confirm I have read the{' '}
                <a href="#" className="underline hover:text-coffee">Privacy Statement</a> and have read
                and accept the <a href="#" className="underline hover:text-coffee">Terms of Service</a>.
              </p>

              <button
                type="submit"
                className="w-full bg-coffee hover:bg-coffee-light text-white font-classy tracking-[0.2em] uppercase text-sm py-4 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="10" width="16" height="10" rx="1.5" />
                  <path d="M8 10V7a4 4 0 018 0v3" />
                </svg>
                Complete Booking
              </button>
              <p className="font-classy text-base text-gray-400 text-center mt-3">
                Our secure encryption protects your personal details at every step.
              </p>
            </form>

            {/* Right: sticky summary */}
            <aside className="lg:sticky lg:top-28">
              <div className="border border-gray-200 shadow-sm">
                <div className="relative h-48 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-coffee text-white font-classy text-[10px] tracking-widest uppercase px-3 py-1">
                    Featured
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="font-classy text-xl text-gray-900 mb-1">{room.name}</h2>
                  <p className="font-classy text-base text-gray-500 mb-3">{HOTEL_ADDRESS}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-50 text-green-700 font-classy text-base font-semibold px-2 py-1">
                      {HOTEL_RATING} Wonderful
                    </span>
                    <span className="font-classy text-base text-gray-400">{HOTEL_REVIEWS} reviews</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 mb-5">
                    <div>
                      <div className="font-classy text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                        Check-in
                      </div>
                      <div className="font-classy text-base text-gray-800">
                        {formatDateWithWeekday(bookingData.dates.checkIn)}
                      </div>
                    </div>
                    <div>
                      <div className="font-classy text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                        Check-out
                      </div>
                      <div className="font-classy text-base text-gray-800">
                        {formatDateWithWeekday(bookingData.dates.checkOut)}
                      </div>
                    </div>
                    <div>
                      <div className="font-classy text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                        Nights
                      </div>
                      <div className="font-classy text-base text-gray-800">{nights}</div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="font-classy text-base tracking-widest text-gray-400 uppercase mb-3">
                      Property Highlights
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {HIGHLIGHTS.map((h) => (
                        <div key={h.label} className="flex items-center gap-2 text-gray-600">
                          <div className="w-4 h-4 text-coffee shrink-0">{h.icon}</div>
                          <span className="font-classy text-base">{h.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <h3 className="font-classy text-sm text-gray-900 mb-2">
                      {roomCount} x {room.name}
                    </h3>
                    <ul className="font-classy text-base text-gray-500 space-y-1">
                      <li>{room.beds}</li>
                      <li>{room.size} • Sleeps {room.maxGuests}</li>
                      <li>Free WiFi • Free self parking</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSpecialRequests((s) => !s)}
                    className="w-full flex items-center justify-between py-2 mb-4 font-classy text-base text-gray-700"
                  >
                    Any special/accessibility requests?
                    <span className="text-coffee">›</span>
                  </button>

                  <h3 className="font-classy text-sm text-gray-900 mb-3">Price Details</h3>
                  <div className="space-y-2 font-classy text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>
                        {roomCount} room{roomCount !== 1 ? 's' : ''} x {nights} night{nights !== 1 ? 's' : ''}
                      </span>
                      <span>{currency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base text-gray-400">
                      <span>{currency(room.priceValue)} per room per night</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes &amp; fees</span>
                      <span>{currency(taxesAndFees)}</span>
                    </div>
                  </div>

                  {!couponVisible ? (
                    <button
                      type="button"
                      onClick={() => setCouponVisible(true)}
                      className="font-classy text-base text-coffee underline mb-4"
                    >
                      Use a coupon
                    </button>
                  ) : (
                    <input
                      type="text"
                      defaultValue={bookingData.specialCode}
                      placeholder="Enter coupon code"
                      className="w-full border border-gray-300 px-3 py-2 text-base font-classy focus:border-coffee outline-none mb-4"
                    />
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-classy text-base text-gray-900">Total</span>
                    <span className="font-classy text-xl text-coffee font-semibold">{currency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-coffee text-white p-5 mt-4">
                <p className="font-classy text-sm leading-relaxed mb-3">
                  Sign in or create an account to save this reservation and collect member rates on
                  future stays.
                </p>
                <div className="flex gap-4 font-classy text-base tracking-widest uppercase underline">
                  <a href="#" className="hover:opacity-80">Sign In</a>
                  <a href="#" className="hover:opacity-80">Create an Account</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage
