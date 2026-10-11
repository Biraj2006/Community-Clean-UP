import React from 'react'
import { Sparkles, ArrowDown, Users, CheckCircle2 } from 'lucide-react'
import heroImage from '../assets/hero-cleanup.jpg'

export default function Hero() {
  const scrollToVolunteer = () => {
    const el = document.querySelector('#volunteer')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lightGreen/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-moss/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 text-left space-y-6">
            {/* Small text badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lightGreen border border-moss/30 text-forest text-xs sm:text-sm font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-moss" />
              <span>CLEAN SOCIETY, BRIGHTER TOMORROW</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest tracking-tight leading-[1.15]">
              Society Clean-Up
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-darkText/80 leading-relaxed font-normal max-w-xl">
              Let's work together for a cleaner, healthier and happier community.
            </p>

            {/* Key highlights / quick badges */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm text-darkText font-medium">
              <span className="inline-flex items-center gap-1.5 bg-white border border-lightGreen px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-forest" /> Resident Driven
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-lightGreen px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-forest" /> Zero Waste Goal
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-lightGreen px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-forest" /> Community Connect
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-join-btn"
                onClick={scrollToVolunteer}
                className="inline-flex items-center justify-center gap-2.5 bg-forest hover:bg-forest-dark text-white font-bold text-base px-8 py-4 rounded-full shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Join the Clean-Up</span>
                <ArrowDown className="w-5 h-5 text-moss animate-bounce" />
              </button>

              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 text-darkText/80 hover:text-forest font-semibold text-sm px-6 py-4 rounded-full hover:bg-lightGreen/50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Environmental Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative background border effect */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-forest/20 to-moss/30 rounded-3xl blur-lg opacity-70 transform -rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-soft-lg border-4 border-white bg-white">
                <img
                  src={heroImage}
                  alt="Community volunteers happily participating in a clean-up drive"
                  className="w-full h-[360px] sm:h-[420px] object-cover hover:scale-102 transition-transform duration-500 ease-out"
                  loading="eager"
                />
                
                {/* Floating card badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-soft border border-lightGreen flex items-center gap-3">
                  <div className="p-2.5 bg-forest text-white rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest uppercase tracking-wide">Community Impact</p>
                    <p className="text-xs text-darkText font-medium">Join hands with neighbors this weekend</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
