import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import OurPlan from '../components/OurPlan'
import ReportForm from '../components/ReportForm'
import VolunteerForm from '../components/VolunteerForm'
import WasteGuide from '../components/WasteGuide'
import Gallery from '../components/Gallery'
import Schedule from '../components/Schedule'
import Footer from '../components/Footer'

export default function Home({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Section 1: Navigation */}
      <Navbar onNavigate={onNavigate} currentPage="home" />

      <main className="flex-1">
        {/* Section 2: Hero */}
        <Hero />

        {/* Section 3: About / The Problem */}
        <About />

        {/* Section 4: Our Plan */}
        <OurPlan />

        {/* Section 5: Report a Dirty Spot */}
        <ReportForm />

        {/* Section 6: Volunteer Sign-Up */}
        <VolunteerForm />

        {/* Section 7: Waste Segregation Guide */}
        <WasteGuide />

        {/* Section 8: Before / After Gallery */}
        <Gallery />

        {/* Section 9: Clean-Up Schedule */}
        <Schedule />
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
