import React, { useState, useEffect } from 'react'
import { HOTEL_TAGLINE, HOTEL_SUBTITLE, HOTEL_TAGLINE_PHILIPPINES } from '@/utils/constants'

const videos = [
  '/video/mixkit-a-family-checking-in-a-luxury-hotel-36736-hd-ready.mp4',
  '/video/mixkit-boutique-hotel-room-and-terrace-4047-hd-ready.mp4',
  '/video/mixkit-busy-avenue-in-las-vegas-4251-hd-ready.mp4',
  '/video/mixkit-corridor-of-an-elegant-hotel-34613-hd-ready.mp4',
  '/video/mixkit-interior-of-a-room-with-terrace-4029-hd-ready.mp4',
  '/video/mixkit-luxury-breakfast-in-a-hotel-15642-hd-ready.mp4',
  '/video/mixkit-woman-opening-dark-curtains-22240-hd-ready.mp4',
]

const HeroSection: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }, 2000) // Change video every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        <video
          key={currentVideoIndex}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/50" />
      </div>

      {/* Hero Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-44 text-center px-4">
        <h2 className="font-classy text-white text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6">
          {HOTEL_TAGLINE} <span className="font-colbiac text-[#fcecb4]">{HOTEL_TAGLINE_PHILIPPINES}</span>
        </h2>
        <p className="font-classy text-white text-base md:text-lg max-w-3xl mb-4">
          {HOTEL_SUBTITLE}
        </p>
      </div>
    </section>
  )
}

export default HeroSection
