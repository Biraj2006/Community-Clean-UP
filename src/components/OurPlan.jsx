import React from 'react'
import { ClipboardList, CalendarDays, Sparkles, Megaphone, ArrowRight } from 'lucide-react'

export default function OurPlan() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Survey',
      description: 'Find and list dirty spots in our society.',
      icon: ClipboardList,
    },
    {
      stepNumber: '02',
      title: 'Plan',
      description: 'Prepare a clean-up plan and collect materials.',
      icon: CalendarDays,
    },
    {
      stepNumber: '03',
      title: 'Clean-Up Day',
      description: 'Work together to clean the identified areas.',
      icon: Sparkles,
    },
    {
      stepNumber: '04',
      title: 'Spread Awareness',
      description: 'Encourage everyone to keep the society clean.',
      icon: Megaphone,
    },
  ]

  return (
    <section id="plan" className="py-16 md:py-24 bg-lightGreen/40 border-y border-lightGreen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Action Strategy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Our Plan
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            A simple, organized approach to achieving a cleaner and healthier residential space.
          </p>
        </div>

        {/* Steps Container: Connected on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                
                {/* Connecting arrow for desktop (between items 1-2, 2-3, 3-4) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-12 -right-4 translate-x-1/2 z-10 text-moss/70 items-center">
                    <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                  </div>
                )}

                {/* Step Card */}
                <div className="w-full bg-white p-7 rounded-2xl border border-moss/20 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col items-center h-full">
                  
                  {/* Step Number & Icon badge */}
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-lightGreen text-forest flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors duration-200 shadow-2xs">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 bg-moss text-white text-xs font-black px-2 py-0.5 rounded-full shadow-2xs">
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-xl font-bold text-forest mb-2">
                    {step.title}
                  </h3>
                  <p className="text-darkText/80 text-sm leading-relaxed">
                    {step.description}
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
