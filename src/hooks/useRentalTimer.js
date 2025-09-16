"use client"

import { useState, useEffect, useMemo } from "react"

export const useRentalTimer = (startTime, endTime) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeInfo = useMemo(() => {
    if (!startTime || !endTime) {
      return {
        duration: 0,
        remaining: 0,
        elapsed: 0,
        isExpired: false,
        formattedDuration: "0h 0m",
        formattedRemaining: "0h 0m",
        formattedElapsed: "0h 0m",
      }
    }

    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = currentTime

    const totalDuration = end - start
    const elapsed = now - start
    const remaining = end - now

    const formatTime = (ms) => {
      const hours = Math.floor(ms / (1000 * 60 * 60))
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    }

    return {
      duration: totalDuration,
      remaining: Math.max(0, remaining),
      elapsed: Math.max(0, elapsed),
      isExpired: remaining <= 0,
      formattedDuration: formatTime(totalDuration),
      formattedRemaining: formatTime(Math.max(0, remaining)),
      formattedElapsed: formatTime(Math.max(0, elapsed)),
    }
  }, [startTime, endTime, currentTime])

  return timeInfo
}
