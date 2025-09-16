"use client"

import { useState } from "react"
import LoginPage from "./LoginPage.jsx"
import RegisterPage from "./RegisterPage.jsx"
import { useAuth } from "../../contexts/AuthContext.jsx"

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode)
  const { login, register, loading, error } = useAuth()

  const handleLogin = async (email, password) => {
    try {
      await login(email, password)
      onClose()
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleRegister = async (userData) => {
    try {
      await register(userData)
      onClose()
    } catch (error) {
      console.error("Register error:", error)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {mode === "login" ? (
        <LoginPage
          onClose={onClose}
          onLogin={handleLogin}
          onSwitchToRegister={() => setMode("register")}
          loading={loading}
          error={error}
        />
      ) : (
        <RegisterPage
          onClose={onClose}
          onRegister={handleRegister}
          onSwitchToLogin={() => setMode("login")}
          loading={loading}
          error={error}
        />
      )}
    </>
  )
}

export default AuthModal
