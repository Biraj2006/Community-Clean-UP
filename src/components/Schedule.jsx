import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, CalendarDays, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Schedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSchedule = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('clean_up_schedule')
        .select('*')
        .order('date', { ascending: true })

      if (err) throw err
      setSchedules(data || [])
    } catch (err) {
      console.error('Failed to load clean-up schedule:', err)
      setError('Unable to load current schedule.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      // Split YYYY-MM-DD to avoid timezone shifting
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        return d.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  return (
    <section id="schedule" className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Upcoming Drives</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Clean-Up Schedule
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Stay updated with our upcoming neighborhood clean-up sessions. Mark your calendar and assemble with your fellow residents.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-forest">
            <RefreshCw className="w-8 h-8 animate-spin text-forest mb-3" />
            <p className="text-sm font-semibold text-darkText/70">Checking schedule from database...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl max-w-lg mx-auto text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : schedules.length === 0 ? (
          /* Exact text required when empty */
          <div className="bg-lightGreen rounded-3xl p-12 border border-moss/30 shadow-soft text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white text-forest flex items-center justify-center shadow-2xs">
              <CalendarDays className="w-8 h-8 text-forest" />
            </div>
            <h3 className="text-xl font-bold text-forest">
              Clean-up schedule will be announced soon.
            </h3>
            <p className="text-darkText/70 text-sm leading-relaxed">
              Our community management committee is finalizing the next target zone. Sign up as a volunteer above to be notified the moment the date is published!
            </p>
          </div>
        ) : (
          /* List of Schedules */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="bg-lightGreen/50 rounded-3xl p-8 border border-moss/30 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-forest text-xs font-bold rounded-full mb-6 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                    Confirmed Drive
                  </div>

                  <div className="space-y-4">
                    {/* Item 1: Date */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-forest text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-moss uppercase tracking-wider block">Date</span>
                        <p className="text-lg font-extrabold text-forest mt-0.5">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>

                    {/* Item 2: Time */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-moss text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-moss uppercase tracking-wider block">Time</span>
                        <p className="text-lg font-bold text-forest mt-0.5">
                          {item.time}
                        </p>
                      </div>
                    </div>

                    {/* Item 3: Meeting Point */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white text-forest flex items-center justify-center shrink-0 shadow-2xs border border-moss/20">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-moss uppercase tracking-wider block">Meeting Point</span>
                        <p className="text-lg font-bold text-forest mt-0.5">
                          {item.meeting_point}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-moss/20 flex items-center justify-between text-xs text-darkText/60">
                  <span>Gloves & garbage bags provided</span>
                  <a
                    href="#volunteer"
                    className="font-bold text-forest hover:text-forest-dark underline"
                  >
                    Join as volunteer &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
