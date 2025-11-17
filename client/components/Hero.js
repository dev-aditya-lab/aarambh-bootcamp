'use client'

import { motion } from 'framer-motion'
import { BsCalendar3 } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '@/lib/config'

export default function Hero({ openModal, config }) {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [regStatus, setRegStatus] = useState(null)
  const fullText = '> initializing_aarambh.exe...'

  const heroTitle = config?.siteInfo?.heroTitle || 'Welcome to Aarambh'
  const heroSubtitle = config?.siteInfo?.heroSubtitle || 'Master Web Development Through Hands-On Learning'
  const bootcampDate = config?.siteInfo?.bootcampDate 
    ? new Date(config.siteInfo.bootcampDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'November 22, 2025'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    const cursorBlink = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorBlink)
    }
  }, [])

  useEffect(() => {
    fetchRegistrationStatus()
  }, [])

  const fetchRegistrationStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/registration/status`)
      setRegStatus(response.data.data)
    } catch (error) {
      console.error('Failed to fetch registration status:', error)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-code-green rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 10 }}
            animate={{
              y: -10,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Terminal-style header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block bg-code-bg border border-code-border rounded-lg p-4 text-left shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-gray-500">terminal@aarambh:~$</span>
            </div>
            <div className="text-code-green font-mono text-sm">
              {text}
              {showCursor && <span className="inline-block w-2 h-4 bg-code-green ml-1"></span>}
            </div>
          </div>
        </motion.div>

        {/* Main heading with glitch effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 
            className="text-7xl md:text-9xl font-bold mb-6 relative inline-block"
            data-text="AARAMBH"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-code-green via-code-blue to-code-purple animate-glow">
              {heroTitle.toUpperCase()}
            </span>
          </h1>
        </motion.div>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-4 mb-12"
        >
          <p className="text-2xl md:text-4xl text-code-blue font-semibold">
            <span className="text-code-yellow">{'<'}</span>
            The Beginning of Your Code Journey
            <span className="text-code-yellow">{' />'}</span>
          </p>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
            <br />
            <span className="text-code-green font-bold">Learn. Build. Deploy.</span>
          </p>
        </motion.div>

        {/* Registration Status */}
        {regStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-code-darker/60 border border-code-green/40 rounded-full backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  !regStatus.registrationOpen ? 'bg-red-500 animate-pulse' :
                  regStatus.isFull ? 'bg-yellow-500 animate-pulse' :
                  regStatus.remainingSeats <= 10 ? 'bg-orange-500 animate-pulse' :
                  'bg-green-500 animate-pulse'
                }`}></div>
                <span className="text-gray-400 text-sm font-mono">Seats:</span>
              </div>
              <span className={`font-bold text-lg font-mono ${
                regStatus.isFull ? 'text-red-500' :
                regStatus.remainingSeats <= 10 ? 'text-yellow-500' :
                'text-code-green'
              }`}>
                {regStatus.remainingSeats} / {regStatus.maxParticipants}
              </span>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={openModal}
            disabled={regStatus && (!regStatus.registrationOpen || regStatus.isFull)}
            whileHover={{ scale: regStatus?.registrationOpen && !regStatus?.isFull ? 1.05 : 1 }}
            whileTap={{ scale: regStatus?.registrationOpen && !regStatus?.isFull ? 0.95 : 1 }}
            className={`group relative px-12 py-5 font-bold text-xl rounded-lg overflow-hidden shadow-2xl transition-all ${
              regStatus && (!regStatus.registrationOpen || regStatus.isFull)
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-code-green to-emerald-500 text-black'
            }`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>
                {regStatus && !regStatus.registrationOpen ? '> Registration_Closed()' :
                 regStatus && regStatus.isFull ? '> Registration_Full()' :
                 '> Register_Now()'}
              </span>
              {regStatus?.registrationOpen && !regStatus?.isFull && (
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              )}
            </span>
            {regStatus?.registrationOpen && !regStatus?.isFull && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-code-green"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          <motion.a
            href="#bootcamp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 border-2 border-code-blue text-code-blue font-bold text-xl rounded-lg hover:bg-code-blue hover:text-black transition-all duration-300 shadow-lg"
          >
            {'{ Learn_More }'}
          </motion.a>
        </motion.div>

        {/* Bootcamp date banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-code-purple/20 to-code-blue/20 border border-code-purple px-8 py-4 rounded-full backdrop-blur-sm">
            <BsCalendar3 className="text-code-yellow text-2xl" />
            <div className="text-left">
              <p className="text-sm text-gray-400">Bootcamp Date</p>
              <p className="text-xl font-bold text-code-purple">{bootcampDate}</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-code-green rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-code-green rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
