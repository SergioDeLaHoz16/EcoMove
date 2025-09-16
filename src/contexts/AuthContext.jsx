"use client"

import { createContext, useContext, useEffect, useReducer } from "react"
import { authService } from "../services/AuthService.js"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH_STATE":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Subscribe to auth service changes
    const unsubscribe = authService.subscribe((authState) => {
      dispatch({
        type: "SET_AUTH_STATE",
        payload: authState,
      })
    })

    // Get initial auth state
    const initialAuthState = {
      user: authService.getCurrentUser(),
      isAuthenticated: authService.isUserAuthenticated(),
    }

    dispatch({
      type: "SET_AUTH_STATE",
      payload: initialAuthState,
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "CLEAR_ERROR" })

    try {
      const user = await authService.login(email, password)
      return user
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "CLEAR_ERROR" })

    try {
      const user = await authService.register(userData)
      return user
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const requireAuth = (callback) => {
    try {
      return authService.requireAuth(callback)
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") {
        return { requiresAuth: true }
      }
      throw error
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    requireAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
