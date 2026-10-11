import React, { useState, useEffect } from 'react'
import { Image, Filter, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'before' | 'after'
  const [error, setError] = useState(null)

  const fetchGallery = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setItems(data || [])
    } catch (err) {
      console.error('Failed to load gallery:', err)
      setError('Unable to load gallery photos at this moment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true
    return item.type === filter
  })

  return (
    <section id="gallery" className="py-16 md:py-24 bg-lightGreen/30 border-y border-lightGreen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Visual Proof</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Before & After Gallery
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Witness the real impact of our resident clean-up efforts. Compare dirty areas before our drive with the sparkling results after.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 inline-flex p-1.5 bg-white rounded-2xl border border-moss/30 shadow-2xs gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-darkText hover:text-forest hover:bg-lightGreen/60'
              }`}
            >
              All Photos ({items.length})
            </button>
            <button
              onClick={() => setFilter('before')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                filter === 'before'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-darkText hover:text-forest hover:bg-lightGreen/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Before (Dirty Area)</span>
            </button>
            <button
              onClick={() => setFilter('after')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                filter === 'after'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-darkText hover:text-forest hover:bg-lightGreen/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-moss" />
              <span>After (Clean Area)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-forest">
            <RefreshCw className="w-8 h-8 animate-spin text-forest mb-3" />
            <p className="text-sm font-semibold text-darkText/70">Loading gallery photos from database...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl max-w-lg mx-auto text-center">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchGallery}
              className="mt-3 text-xs font-bold text-forest underline hover:no-underline"
            >
              Try reloading
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Clear Placeholder When No Images Are Available */
          <div className="bg-white rounded-3xl p-12 border border-moss/30 shadow-soft text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-lightGreen text-forest flex items-center justify-center shadow-2xs">
              <Image className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-forest">No gallery photos available yet</h3>
            <p className="text-darkText/70 text-sm leading-relaxed">
              {filter === 'all'
                ? 'Clean-up drive before and after photos will be uploaded by our society administrator after our upcoming campaign.'
                : `No "${filter}" photos found at the moment. Try selecting another filter or check back after our next drive.`}
            </p>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-moss/20 overflow-hidden shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Image Container with Category Badge */}
                <div className="relative h-56 bg-lightGreen overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none'
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center')
                      e.target.parentElement.innerHTML = `
                        <div class="text-center p-4">
                          <span class="text-xs font-semibold text-darkText/50">Image unavailable</span>
                        </div>
                      `
                    }}
                  />
                  {/* Badge */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${
                      item.type === 'before'
                        ? 'bg-amber-600 text-white'
                        : 'bg-forest text-white'
                    }`}
                  >
                    {item.type === 'before' ? 'Before (Dirty)' : 'After (Clean)'}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-extrabold text-lg text-forest mb-1.5">{item.title}</h3>
                    {item.description && (
                      <p className="text-darkText/75 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-lightGreen flex items-center justify-between text-xs text-darkText/50 font-medium">
                    <span>Clean-Up Record</span>
                    {item.created_at && (
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
