import React, { useState } from 'react'
import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMessage('Supabase is not configured. Please check your .env settings.')
      return
    }

    setLoading(true)

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        throw authError
      }

      const user = authData.user
      if (!user) {
        throw new Error('Authentication succeeded but user record was not found.')
      }

      // 2. Verify admin authorization against protected admin_users database table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (adminCheckError || !adminRecord) {
        // Sign out immediately if not authorized admin
        await supabase.auth.signOut()
        setErrorMessage(
          'Access Denied: You do not have administrator privileges. Only authorized committee accounts may enter the dashboard.'
        )
        setLoading(false)
        return
      }

      // Authorized admin successfully verified
      onLoginSuccess(user)
    } catch (err) {
      console.error('Admin login error:', err)
      setErrorMessage(err.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-lightGreen/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-forest-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Society Clean-Up</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-forest text-white flex items-center justify-center mx-auto shadow-soft mb-4">
            <ShieldCheck className="w-9 h-9 text-moss" />
          </div>
          <h2 className="text-3xl font-extrabold text-forest tracking-tight">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-darkText/70">
            Sign in to manage society reports, volunteers, schedules, and gallery.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-moss/30 shadow-soft">
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-bold text-forest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@society.org"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-bold text-forest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest/60">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-moss/30 rounded-xl text-darkText placeholder-darkText/40 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-2xs text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-dark text-white font-bold text-base shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Helpful Information Box for Admin Setup */}
          <div className="mt-8 pt-6 border-t border-lightGreen/80">
            <div className="bg-lightGreen/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-darkText/80">
              <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-forest">First time setup?</span>
                <p className="mt-0.5">
                  Admin authorization is strictly verified in the database <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">admin_users</code> table to protect private resident data. Check <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">README.md</code> for one-step setup instructions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
