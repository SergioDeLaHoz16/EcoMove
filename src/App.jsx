"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "../src/contexts/AuthContext"
import { InitialDataService } from "../src/services/InitialDataService"

import Header from "../src/components/HomePage/Header"
import HeroSection from "../src/components/HomePage/HeroSection"
import FeaturesSection from "../src/components/HomePage/FeaturesSection"
import CategoriesSection from "../src/components/HomePage/CategorySection"
import RentalSection from "../src/components/HomePage/RentalSection"
import PricingSection from "../src/components/HomePage/PricingSection"
import { RentalCartProvider } from "../src/contexts/RentalCartContext"
import AuthModal from "./components/Auth/AuthModal"
import UserDashboard from "./pages/User/UserDashboard"
import AdminLayout from "./components/Admin/AdminLayout"

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    try {
      InitialDataService.initializeData()
    } catch (error) {
      console.error("Error initializing app data:", error)
    }
  }, [])

  const handleLoginClick = () => {
    setAuthMode("login")
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthMode("register")
    setShowAuthModal(true)
  }

  const handleLoginRequired = () => {
    setAuthMode("login")
    setShowAuthModal(true)
  }

  if (isAuthenticated && user) {
    if (user.tipo === "administrador") {
      return <AdminLayout />
    } else {
      return <UserDashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <HeroSection />
      <FeaturesSection />
     
      <RentalSection onLoginRequired={handleLoginRequired} />
      <CategoriesSection />
      <PricingSection />

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <RentalCartProvider>
        <AppContent />
      </RentalCartProvider>
    </AuthProvider>
  )
}
