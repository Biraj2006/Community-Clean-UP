import React from 'react'
import { Leaf, Heart, ShieldCheck } from 'lucide-react'

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-forest text-white pt-14 pb-8 border-t border-forest-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-moss text-forest rounded-xl inline-flex items-center justify-center">
                <Leaf className="w-5 h-5 text-forest" />
              </span>
              <span className="font-black text-xl tracking-tight text-white">Society Clean-Up</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              A community initiative dedicated to cleaner environments, healthier families, and proactive waste management in our residential society.
            </p>
            <p className="text-xs text-moss font-semibold uppercase tracking-wider">
              Subject: Community Connect
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-moss">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">Why It Matters</a>
              <a href="#plan" className="hover:text-white transition-colors">Our Plan</a>
              <a href="#report" className="hover:text-white transition-colors">Report a Spot</a>
              <a href="#volunteer" className="hover:text-white transition-colors">Volunteer</a>
              <a href="#waste-guide" className="hover:text-white transition-colors">Waste Guide</a>
              <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
              <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            </div>
          </div>

          {/* Admin Access Box */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-moss">Administration</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Authorized society coordinators can manage reports, volunteer lists, schedules, and gallery images.
            </p>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-moss" />
              <span>Admin Portal Access</span>
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Society Clean-Up Initiative. Built for Community Connect.</p>
          <div className="flex items-center gap-1.5 text-white/70">
            <span>Made with care for our society</span>
            <Heart className="w-3.5 h-3.5 text-moss fill-moss" />
          </div>
        </div>
      </div>
    </footer>
  )
}
