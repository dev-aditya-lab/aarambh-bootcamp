'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { API_URL } from '@/lib/config'
import { useRouter } from 'next/navigation'
import { FaLock, FaUser, FaShieldAlt, FaCode } from 'react-icons/fa'
import '@/app/globals.css'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, formData)
      localStorage.setItem('adminToken', response.data.token)
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin))
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-code-darker via-[#0a0a0a] to-code-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-code-green/10 font-mono text-xs"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20,
              opacity: 0
            }}
            animate={{ 
              y: window.innerHeight + 20,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
          >
            {['</>','{}','[]','()','==','!=','&&','||'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f6feb]/20 to-code-green/20 blur-3xl rounded-full"></div>
        
        <div className="relative bg-[#0a0a0a] border-2 border-[#1f6feb]/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1f6feb] to-code-green rounded-2xl mb-4 shadow-xl shadow-[#1f6feb]/50"
            >
              <FaShieldAlt className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-code-green via-[#1f6feb] to-code-purple">
                Admin Panel
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm">
              <FaCode className="text-code-green" />
              <span>Aarambh Dashboard</span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-lg mb-6 text-sm font-mono"
            >
              ❌ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="text-code-green font-mono mb-2 text-sm flex items-center gap-2">
                <FaUser className="text-xs" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoComplete="username"
                  className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3.5 pl-11 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent font-mono transition-all"
                  placeholder="Enter username"
                />
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-code-green font-mono mb-2 text-sm flex items-center gap-2">
                <FaLock className="text-xs" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3.5 pl-11 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent font-mono transition-all"
                  placeholder="Enter password"
                />
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#1f6feb] to-[#388bfd] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#1f6feb]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⚙️
                    </motion.span>
                    Authenticating...
                  </span>
                ) : (
                  'Access Dashboard →'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-code-green to-[#1f6feb] opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs font-mono">
              🔒 Secure Admin Access
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
