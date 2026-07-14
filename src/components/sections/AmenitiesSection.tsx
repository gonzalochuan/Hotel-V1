import React from 'react'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const amenities = [
  {
    name: 'Beachfront',
    icon: (
      <svg {...iconProps}>
        <path d="M12 2C7 2 2.5 7.5 2 13h20C21.5 7.5 17 2 12 2Z" />
        <path d="M12 13v6a2.5 2.5 0 0 1-2.5 2.5" />
        <path d="M2 13h20" />
      </svg>
    )
  },
  {
    name: 'Free WiFi',
    icon: (
      <svg {...iconProps}>
        <path d="M2.5 9.5a14 14 0 0 1 19 0" />
        <path d="M5.8 13.2a9.5 9.5 0 0 1 12.4 0" />
        <path d="M9 16.8a5 5 0 0 1 6 0" />
        <circle cx="12" cy="20" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    name: 'Swimming Pool',
    icon: (
      <svg {...iconProps}>
        <path d="M2.5 10.5c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0 2.8 1.2 4.2 0" />
        <path d="M2.5 15.5c1.4-1.2 2.8-1.2 4.2 0s2.8 1.2 4.2 0 2.8-1.2 4.2 0 2.8 1.2 4.2 0" />
        <path d="M6 6.5 9 3l3 3.5" />
      </svg>
    )
  },
  {
    name: 'Restaurant',
    icon: (
      <svg {...iconProps}>
        <path d="M7 2.5v7a1.6 1.6 0 0 0 3.2 0v-7" />
        <path d="M8.6 2.5v19" />
        <path d="M16.5 2.5c-1.7 0-2.3 2.3-2.3 4.6s.6 4.1 2.3 4.1" />
        <path d="M16.5 2.5v19" />
      </svg>
    )
  },
  {
    name: 'Free Parking',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M9.7 16.5v-9h3.1a2.6 2.6 0 0 1 0 5.2H9.7" />
      </svg>
    )
  },
  {
    name: 'Airport Shuttle',
    icon: (
      <svg {...iconProps}>
        <path d="M3 16V9.5A1.5 1.5 0 0 1 4.5 8h11L19 11.5h1.5A1.5 1.5 0 0 1 22 13v3a1 1 0 0 1-1 1h-1" />
        <path d="M17 16H7" />
        <path d="M3 16h1" />
        <circle cx="7" cy="17.2" r="1.4" />
        <circle cx="17" cy="17.2" r="1.4" />
      </svg>
    )
  },
  {
  name: 'Air Conditioning',
  icon: (
    <svg {...iconProps}>
      <rect x="4" y="5" width="16" height="6" rx="1" />
      <path d="M7 8h10" />
      <path d="M8 13c0 2 2 2 2 4s-2 2-2 4" />
      <path d="M12 13c0 2 2 2 2 4s-2 2-2 4" />
      <path d="M16 13c0 2 2 2 2 4s-2 2-2 4" />
    </svg>
    )
  },
  {
    name: 'Bar',
    icon: (
      <svg {...iconProps}>
        <path d="M4.5 3.5h15L12 12.5l-7.5-9Z" />
        <path d="M12 12.5v8" />
        <path d="M8.3 20.5h7.4" />
      </svg>
    )
  }
]

const AmenitiesSection: React.FC = () => {
  return (
    <section id="amenities" className="py-20 bg-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-classy text-xs tracking-[0.35em] text-coffee uppercase mb-2">
          Comfort &amp; Convenience
        </p>
        <h2 className="font-classy text-4xl md:text-5xl text-gray-900 tracking-wider mb-4">
          What This Place Offers
        </h2>
        <div className="w-14 h-px bg-coffee mx-auto mb-14" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-12">
          {amenities.map((amenity) => (
            <div key={amenity.name} className="group flex flex-col items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full border border-coffee/30 text-coffee group-hover:bg-coffee group-hover:text-white group-hover:border-coffee transition-colors duration-300">
                <div className="w-6 h-6">{amenity.icon}</div>
              </div>
              <p className="font-classy text-sm tracking-wide text-gray-700 uppercase">
                {amenity.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 right-1/2 w-screen max-w-none -translate-x-1/2 mt-36">
        <div className="mx-auto w-full overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <img src="/image/explore.webp" alt="Explore experiences" loading="lazy" className="w-full h-[420px] object-cover md:h-[520px]" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-start px-6 md:px-16">
            <div className="max-w-2xl text-left">
              <p className="font-classy text-xs tracking-[0.35em] uppercase text-[#f8e2c8] mb-3">Explore</p>
              <h3 className="font-classy text-4xl md:text-5xl text-white leading-tight mb-5">Discover nearby experiences in every direction</h3>
              <p className="text-white/85 font-classy text-base md:text-lg mb-8">From beachfront walks to local dining, this is where luxury meets adventure. Explore curated experiences designed to elevate every moment of your stay.</p>
              <a href="/" className="inline-flex items-center justify-center bg-coffee px-8 py-3 text-sm uppercase text-white tracking-[0.18em] transition hover:bg-coffee/90">
                Explore More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AmenitiesSection
