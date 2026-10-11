import React, { useState } from 'react'
import { User, Home, Phone, HeartHandshake, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    flatNumber: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  const validatePhone = (phone) => {
    // Basic phone validation: digits, optional + prefix, min 7 digits, max 15 digits
    const cleaned = phone.replace(/[\s\-()]/g, '')
    return /^(\+)?\d{7,15}$/.test(cleaned)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    const trimmedName = formData.name.trim()
    const trimmedFlat = formData.flatNumber.trim()
    const trimmedPhone = formData.phoneNumber.trim()

    // 1. Validate all fields
    if (!trimmedName) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!trimmedFlat) {
      setErrorMessage('Please enter your flat or apartment number.')
      return
    }

    // 2. Validate the phone number
    if (!trimmedPhone) {
      setErrorMessage('Please enter your phone number.')
      return
    }

    if (!validatePhone(trimmedPhone)) {
      setErrorMessage('Please enter a valid phone number (at least 7 to 15 digits).')
      return
    }

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMessage('Database connection is not configured yet. Please check your Supabase environment setup.')
      return
    }

    // 3. Show a loading state
    setLoading(true)

    try {
      // 4. Save the information to Supabase
      const { data, error } = await supabase
        .from('volunteers')
        .insert([
          {
            name: trimmedName,
            flat_number: trimmedFlat,
            phone: trimmedPhone,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      // 5. Display exact success message
      setSuccessMessage('Thank you! Your response has been recorded.')

      // 6. Clear the form after successful submission
      setFormData({
        name: '',
        flatNumber: '',
        phoneNumber: '',
      })
    } catch (err) {
      console.error('Error saving volunteer:', err)
      let msg = err.message || 'Unable to register volunteer. Please verify your connection or try again shortly.'
      if (err.message && err.message.toLowerCase().includes('could not find the table')) {
        msg = "Database tables are not set up yet. Please run 'supabase/schema.sql' in your Supabase project SQL Editor to create the tables."
      }
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="volunteer" className="py-16 md:py-24 bg-lightGreen/30 border-y border-lightGreen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Join Hands</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Volunteer Sign-Up
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Every helping hand counts. Register to join our society clean-up drives, meet friendly neighbors, and keep our premises green and pristine.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-moss/30 shadow-soft">
          
          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-lightGreen border-2 border-forest/30 text-forest flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">{successMessage}</p>
                <p className="text-xs text-darkText/70 mt-0.5">We look forward to seeing you at our next scheduled drive!</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="volunteer-name" className="block text-sm font-bold text-forest mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="volunteer-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Flat Number */}
              <div>
                <label htmlFor="volunteer-flat" className="block text-sm font-bold text-forest mb-2">
                  Flat Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                    <Home className="w-5 h-5" />
                  </div>
                  <input
                    id="volunteer-flat"
                    name="flatNumber"
                    type="text"
                    required
                    value={formData.flatNumber}
                    onChange={handleChange}
                    placeholder="e.g. B-402"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="volunteer-phone" className="block text-sm font-bold text-forest mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="volunteer-phone"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button: Exact text "I Want to Help" */}
            <button
              id="volunteer-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-base shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Recording registration...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-5 h-5 text-moss" />
                  <span>I Want to Help</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
