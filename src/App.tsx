import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import HeroSection from './components/sections/HeroSection'
import BookingWidget from './components/booking/BookingWidget'
import AboutSection from './components/sections/AboutSection'
import RoomsSection from './components/sections/RoomsSection'
import AmenitiesSection from './components/sections/AmenitiesSection'
import LocationSection from './components/sections/LocationSection'
import Footer from './components/layout/Footer'
import SearchPage from './pages/SearchPage'
import DetailsPage from './pages/DetailsPage'
import PaymentsPage from './pages/PaymentsPage'
import SuccessPage from './pages/SuccessPage'
import { RoomsCatalogProvider } from './context/RoomsCatalogContext'
import { AuthProvider } from './context/AuthContext'

const HomePage: React.FC = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <BookingWidget />
      <AboutSection />
      <RoomsSection />
      <AmenitiesSection />
      <LocationSection />
      <Footer />
    </>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RoomsCatalogProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </BrowserRouter>
      </RoomsCatalogProvider>
    </AuthProvider>
  )
}

export default App
