import React from 'react'
import { HOTEL_NAME } from '@/utils/constants'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg {...iconProps} className="w-4 h-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg {...iconProps} className="w-4 h-4">
        <path d="M14 8.5h2.5V5h-2.5A3.5 3.5 0 0 0 10.5 8.5v2H8V14h2.5v6H14v-6h2.3l.5-3.5H14v-1.5c0-.6.3-.5 1-.5Z" />
      </svg>
    )
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg {...iconProps} className="w-4 h-4">
        <path d="M20 5.5c-.7.4-1.5.6-2.3.8a3.3 3.3 0 0 0-5.6 3v.7A9.3 9.3 0 0 1 4.8 6.3s-3 6.5 3.5 9.3a10 10 0 0 1-6 1.6c6.5 3.7 14 0 14-8.2 0-.3 0-.5-.1-.8A6.7 6.7 0 0 0 20 5.5Z" />
      </svg>
    )
  }
]

const exploreLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Rooms & Suites', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Location', href: '#location' }
]

const Footer: React.FC = () => {
  return (  
    <footer id="footer" className="bg-white text-gray-800">
      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 shrink-0 rounded-full bg-gray-50 border border-gray-200 p-1.5">
              <img src="/image/dphlogo.png" alt={`${HOTEL_NAME} logo`} className="h-full w-full object-contain" />
            </div>
            <span className="font-colbiac text-xl tracking-wide text-gray-900">{HOTEL_NAME}</span>
          </div>
          <p className="font-classy text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
            International by Design, Filipino by Inspiration.
          </p>
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-classy text-xs tracking-[0.3em] uppercase text-coffee mb-5">
            Explore
          </h4>
          <ul className="space-y-3 font-classy text-sm text-gray-500">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-coffee transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-classy text-xs tracking-[0.3em] uppercase text-coffee mb-5">
            Contact
          </h4>
          <ul className="space-y-3 font-classy text-sm text-gray-500">
            <li>Corong-Corong Beach, El Nido, Palawan</li>
            <li>
              <a href="tel:+000000000" className="hover:text-coffee transition-colors">
                +000000000
              </a>
            </li>
            <li>
              <a href="mailto:DelightfulPH@brigada.com" className="hover:text-coffee transition-colors">
                DelightfulPH@brigada.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-classy text-xs tracking-[0.3em] uppercase text-coffee mb-5">
            Hours
          </h4>
          <ul className="space-y-3 font-classy text-sm text-gray-500">
            <li>Check-in: 2:00 PM</li>
            <li>Check-out: 12:00 PM</li>
            <li>Front Desk: 24 Hours</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="font-classy text-xs text-gray-400">
            © 2026 {HOTEL_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6 font-classy text-xs text-gray-400">
            <a href="#" className="hover:text-coffee transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-coffee transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
