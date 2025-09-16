"use client"

import { useState } from "react"
import Header from "../src/components/HomePage/Header"
import HeroSection from "../src/components/HomePage/HeroSection"
import FeaturesSection from "../src/components/HomePage/FeaturesSection"
import CategoriesSection from "../src/components/HomePage/CategorySection"
import ServicesSection from "../src/components/HomePage/ServicesSection"
import RentalSection from "../src/components/HomePage/RentalSection"
import PricingSection from "../src/components/HomePage/PricingSection"
import LoginModal from "../src/components/Auth/LoginModal"
import { AuthProvider } from "../src/contexts/AuthContext"
import { RentalCartProvider } from "../src/contexts/RentalCartContext"

export default function Page() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleRegisterClick = () => {
    setShowRegisterModal(true)
  }

  const handleLoginRequired = () => {
    setShowLoginModal(true)
  }

  return (
    <AuthProvider>
      <RentalCartProvider>
        <div className="min-h-screen bg-white">
          <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
          <HeroSection />
          <FeaturesSection />
          <ServicesSection />
          <RentalSection onLoginRequired={handleLoginRequired} />
          <CategoriesSection />
          <PricingSection />

          {showLoginModal && (
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              onSwitchToRegister={() => {
                setShowLoginModal(false)
                setShowRegisterModal(true)
              }}
            />
          )}
        </div>
      </RentalCartProvider>
    </AuthProvider>
  )
}
