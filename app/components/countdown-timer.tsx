"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`
  }

  if (!mounted) {
    return (
      <div className={`flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-[#2a1b4a] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/30 relative overflow-hidden">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">00</span>
            </div>
            <span className="text-sm sm:text-base md:text-lg font-medium text-purple-300 mt-2">
              {["Days", "Hours", "Minutes", "Seconds"][i]}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="bg-[#2a1b4a] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/30 relative overflow-hidden group transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{formatNumber(timeLeft.days)}</span>
        </div>
        <span className="text-sm sm:text-base md:text-lg font-medium text-purple-300 mt-2">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#2a1b4a] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/30 relative overflow-hidden group transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{formatNumber(timeLeft.hours)}</span>
        </div>
        <span className="text-sm sm:text-base md:text-lg font-medium text-purple-300 mt-2">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#2a1b4a] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/30 relative overflow-hidden group transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{formatNumber(timeLeft.minutes)}</span>
        </div>
        <span className="text-sm sm:text-base md:text-lg font-medium text-purple-300 mt-2">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#2a1b4a] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl shadow-lg flex items-center justify-center border border-purple-800/30 relative overflow-hidden group transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{formatNumber(timeLeft.seconds)}</span>
        </div>
        <span className="text-sm sm:text-base md:text-lg font-medium text-purple-300 mt-2">Seconds</span>
      </div>
    </div>
  )
}
