'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '@/lib/config'
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function FormFieldsManager() {
  const [formFields, setFormFields] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [newField, setNewField] = useState({
    label: '',
    name: '',
    type: 'text',
    placeholder: '',
    required: true,
    isVisible: true,
    options: '',
    description: ''
  })

  useEffect(() => {
    fetchFormFields()
  }, [])

  const fetchFormFields = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`)
      const fields = response.data.formFields || []
      // Ensure all fields have isVisible property set to true if undefined
      const fieldsWithVisibility = fields.map(field => ({
        ...field,
        isVisible: field.isVisible !== false
      }))
      setFormFields(fieldsWithVisibility)
    } catch (error) {
      console.error('Error fetching form fields:', error)
    }
  }

  const saveFormFields = async () => {
    try {
      await axios.put(
        `${API_URL}/api/config/form-fields`,
        { formFields },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      )
      alert('Form fields saved successfully!')
      setHasChanges(false)
    } catch (error) {
      alert('Failed to save form fields')
      console.error('Error:', error)
    }
  }

  const handleAddField = () => {
    if (!newField.label || !newField.name) {
      alert('Label and Name are required!')
      return
    }

    const fieldToAdd = { ...newField, isVisible: true }
    
    // Convert options string to array if needed
    if (['select', 'radio', 'checkbox'].includes(newField.type) && newField.options) {
      fieldToAdd.options = newField.options.split('\n').map(opt => opt.trim()).filter(opt => opt)
    } else {
      delete fieldToAdd.options
    }

    setFormFields([...formFields, fieldToAdd])
    setHasChanges(true)
    
    // Reset new field form
    setNewField({
      label: '',
      name: '',
      type: 'text',
      placeholder: '',
      required: true,
      isVisible: true,
      options: '',
      description: ''
    })
  }

  const handleDeleteField = (index) => {
    if (confirm('Are you sure you want to delete this field?')) {
      const updatedFields = formFields.filter((_, i) => i !== index)
      setFormFields(updatedFields)
      setHasChanges(true)
    }
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const updatedFields = [...formFields]
    const temp = updatedFields[index]
    updatedFields[index] = updatedFields[index - 1]
    updatedFields[index - 1] = temp
    setFormFields(updatedFields)
    setHasChanges(true)
  }

  const handleMoveDown = (index) => {
    if (index === formFields.length - 1) return
    const updatedFields = [...formFields]
    const temp = updatedFields[index]
    updatedFields[index] = updatedFields[index + 1]
    updatedFields[index + 1] = temp
    setFormFields(updatedFields)
    setHasChanges(true)
  }

  const handleToggleVisibility = (index) => {
    const updatedFields = [...formFields]
    updatedFields[index].isVisible = !updatedFields[index].isVisible
    setFormFields(updatedFields)
    setHasChanges(true)
  }

  const startEditing = (index) => {
    setEditingIndex(index)
  }

  const saveEdit = (index) => {
    const field = formFields[index]
    
    // Convert options string to array if needed
    if (['select', 'radio', 'checkbox'].includes(field.type) && typeof field.options === 'string') {
      const updatedFields = [...formFields]
      updatedFields[index].options = field.options.split('\n').map(opt => opt.trim()).filter(opt => opt)
      setFormFields(updatedFields)
    }

    setEditingIndex(null)
    setHasChanges(true)
  }

  const cancelEdit = () => {
    fetchFormFields()
    setEditingIndex(null)
  }

  const handleEditChange = (index, field, value) => {
    const updatedFields = [...formFields]
    updatedFields[index] = { ...updatedFields[index], [field]: value }
    setFormFields(updatedFields)
  }

  return (
    <div className="space-y-8">
      {/* Save Button - Sticky at top when changes exist */}
      {hasChanges && (
        <div className="sticky top-0 z-10 bg-green-600 border border-green-500 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">You have unsaved changes</p>
              <p className="text-green-100 text-sm">Click save to apply your changes</p>
            </div>
            <button
              onClick={saveFormFields}
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <FaSave /> Save All Changes
            </button>
          </div>
        </div>
      )}

      {/* Add New Field */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#1f6feb] mb-4 flex items-center gap-2">
          <FaPlus /> Add New Field
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Label *</label>
            <input
              type="text"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              placeholder="Full Name"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Field Name * (no spaces)</label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
              placeholder="full_name"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone</option>
              <option value="url">URL</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select Dropdown</option>
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkboxes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Placeholder</label>
            <input
              type="text"
              value={newField.placeholder}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
              placeholder="Enter your name"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
            />
          </div>

          {['select', 'radio', 'checkbox'].includes(newField.type) && (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Options (one per line)</label>
              <textarea
                value={newField.options}
                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
                className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent resize-none"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
            <input
              type="text"
              value={newField.description}
              onChange={(e) => setNewField({ ...newField, description: e.target.value })}
              placeholder="This field is for..."
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="w-4 h-4 text-[#1f6feb] border-gray-600 rounded focus:ring-[#1f6feb]"
              />
              Required Field
            </label>

            <label className="flex items-center gap-2 text-sm text-green-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newField.isVisible}
                onChange={(e) => setNewField({ ...newField, isVisible: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-600 rounded focus:ring-green-600"
              />
              Visible (Show in form)
            </label>
          </div>
        </div>

        <button
          onClick={handleAddField}
          className="w-full bg-[#1f6feb] hover:bg-[#1a5cd6] text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          <FaPlus /> Add Field
        </button>
      </div>

      {/* Existing Fields */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Form Fields ({formFields.length})</h3>
        
        {formFields.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No form fields yet. Add your first field above!</p>
        ) : (
          formFields.map((field, index) => (
            <div
              key={index}
              className={`bg-[#0d1117] border rounded-lg p-4 ${
                field.isVisible !== false ? 'border-green-800' : 'border-red-900 opacity-60'
              }`}
            >
              {editingIndex === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleEditChange(index, 'label', e.target.value)}
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Field Name</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => handleEditChange(index, 'name', e.target.value.replace(/\s+/g, '_').toLowerCase())}
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleEditChange(index, 'type', e.target.value)}
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="url">URL</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => handleEditChange(index, 'placeholder', e.target.value)}
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Options (one per line)</label>
                        <textarea
                          value={Array.isArray(field.options) ? field.options.join('\n') : field.options || ''}
                          onChange={(e) => handleEditChange(index, 'options', e.target.value)}
                          rows={4}
                          className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white resize-none"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Description</label>
                      <input
                        type="text"
                        value={field.description || ''}
                        onChange={(e) => handleEditChange(index, 'description', e.target.value)}
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleEditChange(index, 'required', e.target.checked)}
                          className="w-4 h-4"
                        />
                        Required
                      </label>

                      <label className="flex items-center gap-2 text-sm text-green-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.isVisible !== false}
                          onChange={(e) => handleEditChange(index, 'isVisible', e.target.checked)}
                          className="w-4 h-4"
                        />
                        Visible
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(index)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        {field.label}
                        {field.required && <span className="text-red-500 text-sm">*</span>}
                        {field.isVisible !== false ? (
                          <span className="text-green-500 text-xs bg-green-900 px-2 py-1 rounded">✓ Visible</span>
                        ) : (
                          <span className="text-red-500 text-xs bg-red-900 px-2 py-1 rounded">✗ Hidden</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        <span className="text-blue-400">{field.type}</span> • {field.name}
                      </p>
                      {field.description && (
                        <p className="text-xs text-gray-600 mt-1">ℹ️ {field.description}</p>
                      )}
                      {field.options && (
                        <p className="text-xs text-gray-600 mt-1">
                          Options: {Array.isArray(field.options) ? field.options.join(', ') : field.options}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === formFields.length - 1}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <FaArrowDown />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(index)}
                        className={`p-2 rounded ${field.isVisible !== false ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                        title={field.isVisible !== false ? 'Hide Field' : 'Show Field'}
                      >
                        {field.isVisible !== false ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button
                        onClick={() => startEditing(index)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteField(index)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Save Button */}
      {hasChanges && (
        <button
          onClick={saveFormFields}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <FaSave /> Save All Changes
        </button>
      )}
    </div>
  )
}
