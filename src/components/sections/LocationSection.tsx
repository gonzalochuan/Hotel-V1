import React from 'react'

const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-classy text-xs tracking-[0.35em] uppercase text-coffee mb-2">Our</p>
          <h2 className="font-classy text-4xl md:text-5xl text-gray-900 relative inline-block">
            Location
          </h2>
          <div className="mx-auto mt-4 h-px w-14 bg-coffee" />
        </div>
        <div className="overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            title="Corong-Corong Beach map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=119.3860%2C11.1470%2C119.4035%2C11.1660&amp;layer=mapnik&amp;marker=11.1562%2C119.3948"
            className="w-full h-96 md:h-[520px] border-0 filter grayscale contrast-90"
            loading="lazy"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="font-classy text-gray-600">
            Corong-Corong Beach, El Nido, Palawan
          </p>
        </div>
      </div>
    </section>
  )
}

export default LocationSection
