import { HOTEL_NAME } from '@/utils/constants'
import React from 'react'

const AboutSection: React.FC = () => {
  const topRowImages = [
    '/image/intro.jpg',
    '/image/intro2.avif',
    '/image/intro3.avif',
    '/image/intro4.avif',
    '/image/intro.jpg',
    '/image/intro2.avif',
    '/image/intro3.avif',
  ]

  const bottomRowImages = [
    '/image/intro4.avif',
    '/image/intro.jpg',
    '/image/intro2.avif',
    '/image/intro3.avif',
    '/image/intro4.avif',
    '/image/intro.jpg',
    '/image/intro2.avif',
    '/image/intro3.avif',
  ]

  return (
    <section id="about" className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="font-classy text-4xl md:text-5xl text-gray-900 mb-12 mt-14">
          Welcome
          <div className="mx-auto mt-4 h-px w-14 bg-coffee" />
        </h2>
        <p className="font-classy text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Experience unparalleled luxury, comfort, and hospitality at <span className="font-colbiac text-3xl">{HOTEL_NAME} </span>
          Our hotel combines international standards with authentic Filipino inspiration,
          creating a unique and unforgettable experience for every guest.
        </p>
      </div>
      <div className="w-full flex flex-col gap-8 h-[850px] justify-center">
        {/* Top Row */}
        <div className="flex justify-center items-center gap-2">
          {topRowImages.map((src, index) => (
            <img 
              key={`top-${index}`}
              src={src} 
              alt={`Intro ${index + 1}`} 
              className={`w-64 h-[350px] object-cover rounded-lg animate-float-${(index % 4) + 1}`}
            />
          ))}
        </div>
        
        {/* Bottom Row */}
        <div className="flex justify-center items-center gap-2">
          {bottomRowImages.map((src, index) => (
            <img 
              key={`bottom-${index}`}
              src={src} 
              alt={`Intro ${index + 1}`} 
              className={`w-64 h-[350px] object-cover rounded-lg animate-float-${(index % 4) + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
