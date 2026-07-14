import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchMyBookings, type Booking } from '@/services/bookingsApi'

interface AccountPanelProps {
  isOpen: boolean
  onClose: () => void
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const AccountPanel: React.FC<AccountPanelProps> = ({ isOpen, onClose }) => {
  const { session, signInWithGoogle, signOut } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !session) return
    setLoading(true)
    setError(null)
    fetchMyBookings(session.access_token)
      .then(setBookings)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [isOpen, session])

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[95] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100">
          <span className="font-colbiac text-xl tracking-widest text-coffee">Account</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account panel"
            className="text-coffee hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!session ? (
            <div className="flex flex-col gap-4">
              <p className="font-classy text-sm text-gray-500">Sign in to view your bookings.</p>
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="h-12 bg-coffee text-white font-classy tracking-[0.2em] uppercase text-xs hover:bg-coffee-light transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              <p className="font-classy text-sm text-gray-500 mb-1">Signed in as</p>
              <p className="font-classy text-base text-gray-900 mb-6 truncate">{session.user.email}</p>

              <p className="font-classy text-xs tracking-widest text-coffee uppercase mb-4">Your bookings</p>

              {loading ? <p className="font-classy text-sm text-gray-500">Loading…</p> : null}
              {error ? <p className="font-classy text-sm text-red-600">{error}</p> : null}
              {!loading && !error && bookings.length === 0 ? (
                <p className="font-classy text-sm text-gray-500">No bookings yet.</p>
              ) : null}

              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex gap-3 border border-gray-100 p-4">
                    <div className="w-20 h-16 shrink-0 overflow-hidden bg-gray-100">
                      {booking.roomImage ? (
                        <img src={booking.roomImage} alt={booking.roomName ?? ''} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-classy text-sm text-gray-900 truncate">{booking.roomName ?? 'Room'}</p>
                        <span className="shrink-0 bg-green-50 text-green-700 font-classy text-[10px] tracking-widest uppercase px-2 py-0.5">
                          {booking.status}
                        </span>
                      </div>
                      <p className="font-classy text-xs text-gray-500 mt-1">
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </p>
                      <p className="font-classy text-sm text-gray-900 mt-1">
                        ₱{booking.total.toLocaleString('en-PH')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {session ? (
          <div className="px-8 py-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => void signOut()}
              className="w-full h-11 border border-gray-300 font-classy tracking-[0.2em] uppercase text-xs text-gray-700 hover:border-coffee hover:text-coffee transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default AccountPanel
