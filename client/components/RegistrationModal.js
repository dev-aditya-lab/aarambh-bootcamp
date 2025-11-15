'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { API_URL } from '@/lib/config'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function RegistrationModal({ isOpen, onClose, config }) {
  const [formData, setFormData] = useState({})
  const [formFields, setFormFields] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    if (config?.formFields) {
      const visibleFields = config.formFields
        .filter(f => f.visible !== false)
        .sort((a, b) => a.order - b.order)
      setFormFields(visibleFields)
      
      // Initialize form data with default values
      const initialData = {}
      visibleFields.forEach(field => {
        initialData[field.name] = ''
      })
      setFormData(initialData)
    }
  }, [config])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await axios.post(`${API_URL}/api/register`, formData)
      setSubmitStatus({ type: 'success', message: 'Registration successful!' })
      setTimeout(() => {
        onClose()
        // Reset form
        const resetData = {}
        formFields.forEach(field => {
          resetData[field.name] = ''
        })
        setFormData(resetData)
        setSubmitStatus(null)
      }, 2000)
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <div className="min-h-screen flex items-center justify-center p-4 py-8">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {formFields.map((field, index) => {
                const isTextArea = field.type === 'textarea'
                const isSelect = field.type === 'select'
                const isRadio = field.type === 'radio'
                const isCheckbox = field.type === 'checkbox'
                const isFullWidth = isTextArea || isSelect || isRadio

                // Skip if this field was already rendered as part of a 2-column grid
                const prevField = formFields[index - 1]
                const isPrevFullWidth = prevField && ['textarea', 'select', 'radio'].includes(prevField.type)
                
                // Check if previous field is NOT full width AND previous field can pair with current
                if (index > 0 && !isFullWidth && !isPrevFullWidth) {
                  return null
                }

                // Check if we can pair with next field for 2-column layout
                const nextField = formFields[index + 1]
                const canPair = !isFullWidth && nextField && !['textarea', 'select', 'radio'].includes(nextField.type)

                return (
                  <div key={field.name} className={canPair ? 'grid md:grid-cols-2 gap-6' : ''}>
                    {/* First field */}
                    <div>
                      <label className="block text-[#7ee787] font-mono mb-2 text-sm">
                        <span className="text-[#ff7b72]">let</span> {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {!field.required && <span className="text-gray-600 text-xs ml-2">(optional)</span>}
                        <span className="text-[#d2a8ff]">:</span>
                      </label>
                      
                      {field.description && (
                        <p className="text-xs text-code-blue mb-2">ℹ️ {field.description}</p>
                      )}

                      {isTextArea ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          required={field.required}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all font-mono text-sm resize-none"
                        />
                      ) : isSelect ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          required={field.required}
                          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all font-mono text-sm"
                        >
                          <option value="" className="bg-[#161b22]">Select {field.label}</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt} className="bg-[#161b22]">{opt}</option>
                          ))}
                        </select>
                      ) : isRadio ? (
                        <div className="grid grid-cols-3 gap-4">
                          {field.options?.map((opt, i) => (
                            <label
                              key={i}
                              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all ${
                                formData[field.name] === opt
                                  ? 'border-[#1f6feb] bg-[#1f6feb]/20 text-[#79c0ff] shadow-lg shadow-[#1f6feb]/30'
                                  : 'border-gray-700 text-gray-400 hover:border-[#1f6feb]/50 hover:text-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={opt}
                                checked={formData[field.name] === opt}
                                onChange={handleChange}
                                required={field.required}
                                className="hidden"
                              />
                              <span className="font-mono capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : isCheckbox ? (
                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={formData[field.name] || false}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                            required={field.required}
                            className="w-4 h-4 text-[#1f6feb] focus:ring-[#1f6feb]"
                          />
                          {field.placeholder}
                        </label>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all font-mono text-sm"
                        />
                      )}

                      {field.warning && (
                        <p className="text-xs text-yellow-500 mt-2">⚠️ {field.warning}</p>
                      )}
                    </div>

                    {/* Second field if paired */}
                    {canPair && nextField && (
                      <div>
                        <label className="block text-[#7ee787] font-mono mb-2 text-sm">
                          <span className="text-[#ff7b72]">let</span> {nextField.label}
                          {nextField.required && <span className="text-red-500 ml-1">*</span>}
                          {!nextField.required && <span className="text-gray-600 text-xs ml-2">(optional)</span>}
                          <span className="text-[#d2a8ff]">:</span>
                        </label>
                        
                        {nextField.description && (
                          <p className="text-xs text-code-blue mb-2">ℹ️ {nextField.description}</p>
                        )}

                        <input
                          type={nextField.type}
                          name={nextField.name}
                          value={formData[nextField.name] || ''}
                          onChange={handleChange}
                          required={nextField.required}
                          placeholder={nextField.placeholder}
                          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all font-mono text-sm"
                        />

                        {nextField.warning && (
                          <p className="text-xs text-yellow-500 mt-2">⚠️ {nextField.warning}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              }).filter(Boolean)}

              {/* Status Message */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg font-mono text-sm border-2 ${
                    submitStatus.type === 'success'
                      ? 'bg-[#238636]/10 text-[#7ee787] border-[#238636]'
                      : 'bg-[#da3633]/10 text-[#ff7b72] border-[#da3633]'
                  }`}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#1f6feb] to-[#388bfd] text-white font-bold rounded-lg hover:shadow-xl hover:shadow-[#1f6feb]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>&gt;</span> Submit_Registration()
                    </span>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="sm:w-auto w-full px-8 py-4 border-2 border-gray-700 text-gray-400 font-bold rounded-lg hover:border-[#da3633] hover:text-[#ff7b72] hover:bg-[#da3633]/10 transition-all font-mono"
                >
                  Cancel
                </motion.button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-[#d2a8ff] font-mono text-sm">
                {'}'} <span className="text-gray-600">// End of registration</span>
              </p>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
