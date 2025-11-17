'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { API_URL } from '@/lib/config'

export default function RegistrationModal({ isOpen, onClose }) {
  const [formFields, setFormFields] = useState([])
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [regStatus, setRegStatus] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchFormFields()
      checkRegistrationStatus()
    }
  }, [isOpen])

  const checkRegistrationStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/registration/status`)
      setRegStatus(response.data.data)
    } catch (error) {
      console.error('Failed to check registration status:', error)
    }
  }

  const fetchFormFields = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`)
      const visibleFields = response.data.formFields.filter(field => field.isVisible !== false)
      setFormFields(visibleFields)
      
      // Initialize form data
      const initialData = {}
      visibleFields.forEach(field => {
        initialData[field.name] = field.type === 'checkbox' ? [] : ''
      })
      setFormData(initialData)
    } catch (error) {
      console.error('Error fetching form fields:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => {
        const currentValues = Array.isArray(prev[name]) ? prev[name] : []
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] }
        } else {
          return { ...prev, [name]: currentValues.filter(v => v !== value) }
        }
      })
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert checkbox arrays to strings for backend
      const submitData = { ...formData }
      Object.keys(submitData).forEach(key => {
        if (Array.isArray(submitData[key])) {
          submitData[key] = submitData[key].join(', ')
        }
      })

      const response = await axios.post(`${API_URL}/api/registration`, submitData)
      alert(response.data.message || 'Registration successful! 🎉')
      
      // Reset form
      const resetData = {}
      formFields.forEach(field => {
        resetData[field.name] = field.type === 'checkbox' ? [] : ''
      })
      setFormData(resetData)
      onClose()
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field) => {
    const baseInputClass = "w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all font-mono text-sm"

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClass} resize-none`}
          />
        )

      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:border-[#1f6feb]/50 transition-all">
                <input
                  type="radio"
                  name={field.name}
                  value={opt}
                  checked={formData[field.name] === opt}
                  onChange={handleChange}
                  required={field.required}
                  className="w-4 h-4 text-[#1f6feb] border-gray-600 focus:ring-[#1f6feb] focus:ring-2"
                />
                <span className="text-gray-300">{opt}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:border-[#1f6feb]/50 transition-all">
                <input
                  type="checkbox"
                  name={field.name}
                  value={opt}
                  checked={Array.isArray(formData[field.name]) && formData[field.name].includes(opt)}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#1f6feb] border-gray-600 rounded focus:ring-[#1f6feb] focus:ring-2"
                />
                <span className="text-gray-300">{opt}</span>
              </label>
            ))}
          </div>
        )

      default:
        return (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-center justify-center p-4 py-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#1f6feb]/30 rounded-xl shadow-2xl shadow-[#1f6feb]/20 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Terminal Header */}
          <div className="mb-8 pb-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600 transition-colors" onClick={onClose}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-gray-500 font-mono">registration_form.js</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-[#1f6feb] transition-colors text-3xl font-light leading-none"
                type="button"
              >
                ×
              </button>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-[#ff7b72]">const</span>
              <span className="text-[#79c0ff]"> registration </span>
              <span className="text-[#d2a8ff]">= () =&gt; {`{`}</span>
            </h2>
            <p className="text-gray-500 text-sm font-mono">// Fill in your details to join the bootcamp</p>
          </div>

          {/* Registration Status Warning */}
          {regStatus && !regStatus.registrationOpen && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-500 font-semibold">⛔ Registration Closed</p>
              <p className="text-red-400 text-sm">Registrations are currently not open.</p>
            </div>
          )}

          {regStatus && regStatus.isFull && (
            <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-yellow-500 font-semibold">🎫 Registration Full</p>
              <p className="text-yellow-400 text-sm">All {regStatus.maxParticipants} seats have been taken.</p>
            </div>
          )}

          {regStatus && regStatus.registrationOpen && !regStatus.isFull && regStatus.remainingSeats <= 10 && (
            <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4 mb-6">
              <p className="text-orange-500 font-semibold">⚠️ Limited Seats</p>
              <p className="text-orange-400 text-sm">Only {regStatus.remainingSeats} seats remaining!</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {formFields.map((field) => {
                const isFullWidth = ['textarea', 'select', 'radio', 'checkbox'].includes(field.type)
                
                return (
                  <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
                    <label className="block text-[#7ee787] font-mono mb-2 text-sm">
                      <span className="text-[#ff7b72]">let</span> {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {!field.required && <span className="text-gray-600 text-xs ml-2">(optional)</span>}
                      <span className="text-[#d2a8ff]">:</span>
                    </label>
                    
                    {field.description && (
                      <p className="text-xs text-blue-400 mb-2">ℹ️ {field.description}</p>
                    )}

                    {renderField(field)}
                  </div>
                )
              })}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <motion.button
                type="submit"
                disabled={loading || (regStatus && (!regStatus.registrationOpen || regStatus.isFull))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#1f6feb] hover:bg-[#1a5cd6] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-[#1f6feb]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  '> Submit_Registration()'
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-600 text-sm font-mono text-center">{`}`}</p>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
