import React, { useState } from 'react'
import { Leaf, Menu, X, ShieldCheck } from 'lucide-react'

export default function Navbar({ onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Our Plan', href: '#plan' },
    { name: 'Report a Spot', href: '#report' },
    { name: 'Volunteer', href: '#volunteer' },
    { name: 'Waste Guide', href: '#waste-guide' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Schedule', href: '#schedule' },
  ]

  const handleLinkClick = (e, href) => {
    setMobileMenuOpen(false)
    if (currentPage !== 'home') {
      e.preventDefault()
      onNavigate('home')
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const handleJoinClick = () => {
    setMobileMenuOpen(false)
    if (currentPage !== 'home') {
      onNavigate('home')
      setTimeout(() => {
        const element = document.querySelector('#volunteer')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.querySelector('#volunteer')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-lightGreen shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Leaf Icon */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2.5 text-forest font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="p-2 bg-lightGreen rounded-xl text-forest shadow-xs inline-flex items-center justify-center">
              <Leaf className="w-6 h-6 text-forest" />
            </span>
            <div className="flex flex-col">
              <span className="text-forest font-extrabold text-lg leading-tight">Society Clean-Up</span>
              <span className="text-[11px] font-medium text-moss tracking-wider uppercase">Community Connect</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-darkText hover:text-forest hover:bg-lightGreen/60 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onNavigate(currentPage === 'admin' ? 'home' : 'admin')}
              className="px-3.5 py-2 text-xs font-semibold text-darkText/70 hover:text-forest hover:bg-lightGreen rounded-lg border border-transparent hover:border-moss/40 flex items-center gap-1.5 transition-all"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-forest" />
              {currentPage === 'admin' ? 'Exit Admin' : 'Admin'}
            </button>
            <button
              id="navbar-join-btn"
              onClick={handleJoinClick}
              className="bg-forest hover:bg-forest-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Join the Clean-Up
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-darkText hover:text-forest hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-forest transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-lightGreen bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-darkText hover:text-forest hover:bg-lightGreen transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-lightGreen/80 flex flex-col gap-2.5">
            <button
              onClick={handleJoinClick}
              className="w-full text-center bg-forest hover:bg-forest-dark text-white font-semibold py-3 px-4 rounded-xl shadow-soft transition-colors"
            >
              Join the Clean-Up
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onNavigate(currentPage === 'admin' ? 'home' : 'admin')
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-darkText/80 hover:text-forest bg-lightGreen/50 rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-forest" />
              {currentPage === 'admin' ? 'Return to Public Site' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
