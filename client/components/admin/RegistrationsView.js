'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '@/lib/config'
import { FaDownload, FaTrash, FaSearch, FaEye } from 'react-icons/fa'

export default function RegistrationsView() {
  const [registrations, setRegistrations] = useState([])
  const [formFields, setFormFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReg, setSelectedReg] = useState(null)

  useEffect(() => {
    fetchFormFields()
    fetchRegistrations()
  }, [])

  const fetchFormFields = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`)
      setFormFields(response.data.formFields || [])
    } catch (error) {
      console.error('Failed to fetch form fields:', error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/registration`)
      // API returns { success, data, pagination } format
      const registrationData = response.data?.data || response.data || []
      const data = Array.isArray(registrationData) ? registrationData : []
      setRegistrations(data)
      console.log('Fetched registrations:', data)
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return
    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`${API_URL}/api/registration/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchRegistrations()
      alert('Deleted successfully')
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  const exportToCSV = () => {
    if (registrations.length === 0) return
    
    // Get all unique fields from registrations
    const allFields = [...new Set(registrations.flatMap(reg => Object.keys(reg)))]
    const exportFields = allFields.filter(f => f !== '_id' && f !== '__v' && f !== 'createdAt' && f !== 'updatedAt')
    
    const headers = exportFields.join(',')
    const rows = registrations.map(reg => 
      exportFields.map(field => {
        const value = reg[field] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredRegistrations = registrations.filter(reg => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return Object.values(reg).some(value => 
      String(value).toLowerCase().includes(searchLower)
    )
  })

  // Get display columns (first 5 visible fields)
  const displayFields = formFields.filter(f => f.isVisible !== false).slice(0, 5)

  if (loading) return <div className="text-center py-12 text-code-green">Loading...</div>

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-code-green">Registrations ({registrations.length})</h2>
          <p className="text-gray-400 text-sm">Manage bootcamp registrations</p>
        </div>
        <button onClick={exportToCSV} disabled={registrations.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-code-green text-black rounded-lg font-bold disabled:opacity-50">
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              {displayFields.map(field => (
                <th key={field.name} className="text-left py-3 px-4 text-code-green font-mono">
                  {field.label}
                </th>
              ))}
              <th className="text-left py-3 px-4 text-code-green font-mono">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg) => (
              <tr key={reg._id} className="border-b border-gray-800 hover:bg-[#161b22]">
                {displayFields.map(field => (
                  <td key={field.name} className="py-3 px-4 text-gray-400">
                    {field.name === displayFields[0]?.name ? (
                      <span className="text-white font-medium">{reg[field.name] || '-'}</span>
                    ) : (
                      <span>{reg[field.name] || '-'}</span>
                    )}
                  </td>
                ))}
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedReg(reg)}
                      className="p-2 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/30"
                      title="View Details">
                      <FaEye />
                    </button>
                    <button onClick={() => handleDelete(reg._id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                      title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedReg(null)}>
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-gray-800 rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-code-green">Registration Details</h3>
              <button onClick={() => setSelectedReg(null)}
                className="text-gray-500 hover:text-white text-2xl">
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.filter(f => f.isVisible !== false).map(field => (
                <div key={field.name} className="bg-[#161b22] border border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                  <p className="text-white">{selectedReg[field.name] || '-'}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedReg(null)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredRegistrations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No registrations found matching your search' : 'No registrations yet'}
        </div>
      )}
    </div>
  )
}
