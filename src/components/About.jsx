import React from 'react'
import { HeartPulse, Wind, Smile, Sparkles } from 'lucide-react'

export default function About() {
  const cards = [
    {
      title: 'Better Health',
      description: 'Less garbage helps reduce health problems.',
      icon: HeartPulse,
      badge: 'Hygiene & Wellness',
    },
    {
      title: 'Clean Environment',
      description: 'Clean surroundings help protect our air and water.',
      icon: Wind,
      badge: 'Eco Balance',
    },
    {
      title: 'Happier Community',
      description: 'Clean spaces make our society more pleasant.',
      icon: Smile,
      badge: 'Social Harmony',
    },
    {
      title: 'Safe and Beautiful',
      description: 'A clean society is a better place to live.',
      icon: Sparkles,
      badge: 'Quality Living',
    },
  ]

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">The Importance</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Why a Clean Society Matters
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Taking responsibility for our shared residential environment leads to lasting benefits for everyone.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-lightGreen p-7 rounded-2xl border border-moss/20 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white text-forest flex items-center justify-center shadow-2xs group-hover:bg-forest group-hover:text-white transition-colors duration-200 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-moss uppercase tracking-wider">{card.badge}</span>
                  <h3 className="text-xl font-bold text-forest mt-1 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-darkText/80 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
