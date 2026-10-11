import React, { useState } from 'react'
import { MapPin, FileText, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function ReportForm() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear messages when user types again
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    // 1. Validate inputs
    const trimmedLocation = formData.location.trim()
    const trimmedDescription = formData.description.trim()

    if (!trimmedLocation) {
      setErrorMessage('Please provide a specific location in the society.')
      return
    }

    if (!trimmedDescription) {
      setErrorMessage('Please provide a brief description of the dirty spot.')
      return
    }

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMessage('Database connection is not configured yet. Please check your Supabase environment setup.')
      return
    }

    // 2. Show loading state
    setLoading(true)

    try {
      // 3. Save report to the Supabase database
      const { data, error } = await supabase
        .from('dirty_spot_reports')
        .insert([
          {
            location: trimmedLocation,
            description: trimmedDescription,
            status: 'Pending',
          },
        ])
        .select()

      if (error) {
        throw error
      }

      // 4. Display exact success message
      setSuccessMessage('Thank you! Your response has been recorded.')

      // 5. Clear the form after successful submission
      setFormData({
        location: '',
        description: '',
      })
    } catch (err) {
      console.error('Error reporting spot:', err)
      let msg = err.message || 'Unable to submit report. Please verify your connection or try again shortly.'
      if (err.message && err.message.toLowerCase().includes('could not find the table')) {
        msg = "Database tables are not set up yet. Please run 'supabase/schema.sql' in your Supabase project SQL Editor to create the tables."
      }
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="report" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Spot Something Dirty?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Report a Dirty Spot
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Notice garbage, overflowing bins, or an unclean area in our society? Let us know so our clean-up team can take action!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-lightGreen p-8 sm:p-10 rounded-3xl border border-moss/30 shadow-soft">
          
          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-white border-2 border-forest/30 text-forest flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">{successMessage}</p>
                <p className="text-xs text-darkText/70 mt-0.5">Our committee will review this report and schedule a cleaning.</p>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Field */}
            <div>
              <label htmlFor="report-location" className="block text-sm font-bold text-forest mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  id="report-location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Near Block B Basement, Behind Park Bench"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="report-description" className="block text-sm font-bold text-forest mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-forest/60">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  id="report-description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what needs cleaning (e.g. plastic bottles scattered, dry leaves piled up, overflowing waste bin)..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="report-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-base shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-moss" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
