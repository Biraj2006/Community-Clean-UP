import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { supabase, isSupabaseConfigured } from './lib/supabase'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'login' | 'admin'
  const [adminUser, setAdminUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)

  // Verify whether a user is an authorized admin
  const verifyAdminStatus = async (user) => {
    if (!user || !supabase) return false
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        return false
      }
      return true
    } catch {
      return false
    }
  }

  // Check auth session on startup
  useEffect(() => {
    const checkInitialAuth = async () => {
      // Sync URL hash
      const hash = window.location.hash.toLowerCase()
      if (hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentPage('admin')
      } else if (hash === '#login' || window.location.pathname === '/login') {
        setCurrentPage('login')
      }

      if (!isSupabaseConfigured() || !supabase) {
        setAuthChecking(false)
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const isAdmin = await verifyAdminStatus(session.user)
          if (isAdmin) {
            setAdminUser(session.user)
          } else {
            // Not an admin, sign them out
            await supabase.auth.signOut()
            setAdminUser(null)
          }
        }
      } catch (err) {
        console.error('Initial session check error:', err)
      } finally {
        setAuthChecking(false)
      }
    }

    checkInitialAuth()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const isAdmin = await verifyAdminStatus(session.user)
          if (isAdmin) {
            setAdminUser(session.user)
          } else {
            await supabase.auth.signOut()
            setAdminUser(null)
          }
        } else if (event === 'SIGNED_OUT') {
          setAdminUser(null)
        }
      })

      return () => {
        subscription?.unsubscribe()
      }
    }
  }, [])

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page === 'home') {
      window.history.pushState(null, '', '#home')
    } else if (page === 'admin') {
      window.history.pushState(null, '', '#admin')
    } else if (page === 'login') {
      window.history.pushState(null, '', '#login')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginSuccess = (user) => {
    setAdminUser(user)
    setCurrentPage('admin')
    window.history.pushState(null, '', '#admin')
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setAdminUser(null)
    setCurrentPage('home')
    window.history.pushState(null, '', '#home')
  }

  // Handle routing render
  if (currentPage === 'admin') {
    if (adminUser) {
      return (
        <AdminDashboard
          user={adminUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
      />
    )
  }

  if (currentPage === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
      />
    )
  }

  return <Home onNavigate={handleNavigate} />
}
