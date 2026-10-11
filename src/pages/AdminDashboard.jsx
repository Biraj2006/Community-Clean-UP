import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ShieldAlert,
  Upload,
  CheckCircle2,
  X,
  FileText,
  MapPin,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function AdminDashboard({ user, onLogout, onNavigate }) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'reports' | 'volunteers' | 'schedule' | 'gallery'

  // Data states
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalReports: 0,
    pendingReports: 0,
    cleanedSpots: 0,
  })

  const [reports, setReports] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [schedules, setSchedules] = useState([])
  const [galleryItems, setGalleryItems] = useState([])

  // Feedback states
  const [actionSuccess, setActionSuccess] = useState('')
  const [actionError, setActionError] = useState('')

  // Schedule modal / edit states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    meeting_point: '',
  })
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false)

  // Gallery modal / form states
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    type: 'before', // 'before' | 'after'
    description: '',
    imageUrl: '',
  })
  const [galleryFile, setGalleryFile] = useState(null)
  const [gallerySubmitting, setGallerySubmitting] = useState(false)

  // Fetch all dashboard data from Supabase
  const fetchAllData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      setRefreshing(true)
      setActionError('')

      // 1. Fetch Reports
      const { data: reportsData, error: reportsErr } = await supabase
        .from('dirty_spot_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (reportsErr) console.error('Error fetching reports:', reportsErr)
      const currentReports = reportsData || []
      setReports(currentReports)

      // 2. Fetch Volunteers
      const { data: volunteersData, error: volunteersErr } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false })

      if (volunteersErr) console.error('Error fetching volunteers:', volunteersErr)
      const currentVolunteers = volunteersData || []
      setVolunteers(currentVolunteers)

      // 3. Fetch Schedule
      const { data: scheduleData, error: scheduleErr } = await supabase
        .from('clean_up_schedule')
        .select('*')
        .order('date', { ascending: true })

      if (scheduleErr) console.error('Error fetching schedule:', scheduleErr)
      setSchedules(scheduleData || [])

      // 4. Fetch Gallery
      const { data: galleryData, error: galleryErr } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (galleryErr) console.error('Error fetching gallery:', galleryErr)
      setGalleryItems(galleryData || [])

      // 5. Calculate live stats
      const pending = currentReports.filter((r) => r.status === 'Pending').length
      const cleaned = currentReports.filter((r) => r.status === 'Cleaned').length

      setStats({
        totalVolunteers: currentVolunteers.length,
        totalReports: currentReports.length,
        pendingReports: pending,
        cleanedSpots: cleaned,
      })
    } catch (err) {
      console.error('Error refreshing dashboard:', err)
      setActionError('Failed to refresh data: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Auto-clear success message after 4 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess])

  // --- REPORT MANAGEMENT ---
  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      setActionError('')
      const { error } = await supabase
        .from('dirty_spot_reports')
        .update({ status: newStatus })
        .eq('id', reportId)

      if (error) throw error

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      )

      // Update live counters
      setStats((prev) => {
        const updated = reports.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
        return {
          ...prev,
          pendingReports: updated.filter((r) => r.status === 'Pending').length,
          cleanedSpots: updated.filter((r) => r.status === 'Cleaned').length,
        }
      })

      setActionSuccess(`Report status updated to "${newStatus}".`)
    } catch (err) {
      console.error('Error updating report status:', err)
      setActionError('Failed to update status: ' + err.message)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return

    try {
      setActionError('')
      const { error } = await supabase.from('dirty_spot_reports').delete().eq('id', reportId)
      if (error) throw error

      const filtered = reports.filter((r) => r.id !== reportId)
      setReports(filtered)
      setStats((prev) => ({
        ...prev,
        totalReports: filtered.length,
        pendingReports: filtered.filter((r) => r.status === 'Pending').length,
        cleanedSpots: filtered.filter((r) => r.status === 'Cleaned').length,
      }))
      setActionSuccess('Report removed successfully.')
    } catch (err) {
      console.error('Error deleting report:', err)
      setActionError('Failed to delete report: ' + err.message)
    }
  }

  // --- VOLUNTEER MANAGEMENT ---
  const handleDeleteVolunteer = async (volunteerId) => {
    if (!window.confirm('Are you sure you want to remove this volunteer record?')) return

    try {
      setActionError('')
      const { error } = await supabase.from('volunteers').delete().eq('id', volunteerId)
      if (error) throw error

      const filtered = volunteers.filter((v) => v.id !== volunteerId)
      setVolunteers(filtered)
      setStats((prev) => ({
        ...prev,
        totalVolunteers: filtered.length,
      }))
      setActionSuccess('Volunteer record removed.')
    } catch (err) {
      console.error('Error deleting volunteer:', err)
      setActionError('Failed to delete volunteer: ' + err.message)
    }
  }

  // --- SCHEDULE MANAGEMENT ---
  const handleOpenScheduleModal = (item = null) => {
    if (item) {
      setEditingSchedule(item)
      setScheduleForm({
        date: item.date,
        time: item.time,
        meeting_point: item.meeting_point,
      })
    } else {
      setEditingSchedule(null)
      setScheduleForm({
        date: '',
        time: '',
        meeting_point: '',
      })
    }
    setIsScheduleModalOpen(true)
  }

  const handleSaveSchedule = async (e) => {
    e.preventDefault()
    if (!scheduleForm.date || !scheduleForm.time.trim() || !scheduleForm.meeting_point.trim()) {
      setActionError('Please fill in all schedule fields.')
      return
    }

    setScheduleSubmitting(true)
    setActionError('')

    try {
      if (editingSchedule) {
        // Edit schedule
        const { error } = await supabase
          .from('clean_up_schedule')
          .update({
            date: scheduleForm.date,
            time: scheduleForm.time.trim(),
            meeting_point: scheduleForm.meeting_point.trim(),
          })
          .eq('id', editingSchedule.id)

        if (error) throw error
        setActionSuccess('Schedule updated successfully!')
      } else {
        // Add schedule
        const { error } = await supabase.from('clean_up_schedule').insert([
          {
            date: scheduleForm.date,
            time: scheduleForm.time.trim(),
            meeting_point: scheduleForm.meeting_point.trim(),
          },
        ])

        if (error) throw error
        setActionSuccess('New clean-up schedule created!')
      }

      setIsScheduleModalOpen(false)
      fetchAllData()
    } catch (err) {
      console.error('Error saving schedule:', err)
      setActionError('Failed to save schedule: ' + err.message)
    } finally {
      setScheduleSubmitting(false)
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Delete this scheduled event?')) return

    try {
      setActionError('')
      const { error } = await supabase.from('clean_up_schedule').delete().eq('id', scheduleId)
      if (error) throw error

      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId))
      setActionSuccess('Schedule removed successfully.')
    } catch (err) {
      console.error('Error deleting schedule:', err)
      setActionError('Failed to delete schedule: ' + err.message)
    }
  }

  // --- GALLERY MANAGEMENT ---
  const handleOpenGalleryModal = () => {
    setGalleryForm({
      title: '',
      type: 'before',
      description: '',
      imageUrl: '',
    })
    setGalleryFile(null)
    setIsGalleryModalOpen(true)
  }

  const handleSaveGallery = async (e) => {
    e.preventDefault()
    if (!galleryForm.title.trim()) {
      setActionError('Please enter a photo title.')
      return
    }

    if (!galleryFile && !galleryForm.imageUrl.trim()) {
      setActionError('Please select a photo file to upload or provide an image URL.')
      return
    }

    setGallerySubmitting(true)
    setActionError('')

    try {
      let finalImageUrl = galleryForm.imageUrl.trim()

      // If a file is uploaded, push to Supabase Storage bucket 'gallery-images'
      if (galleryFile) {
        const fileExt = galleryFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, galleryFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error('Supabase Storage upload error: ' + uploadError.message)
        }

        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath)

        finalImageUrl = urlData.publicUrl
      }

      // Insert record into gallery table
      const { error: insertError } = await supabase.from('gallery').insert([
        {
          title: galleryForm.title.trim(),
          image_url: finalImageUrl,
          type: galleryForm.type,
          description: galleryForm.description.trim() || null,
        },
      ])

      if (insertError) throw insertError

      setActionSuccess('Gallery photo uploaded successfully!')
      setIsGalleryModalOpen(false)
      fetchAllData()
    } catch (err) {
      console.error('Error saving gallery item:', err)
      setActionError('Failed to upload photo: ' + err.message)
    } finally {
      setGallerySubmitting(false)
    }
  }

  const handleDeleteGallery = async (item) => {
    if (!window.confirm(`Delete photo "${item.title}"?`)) return

    try {
      setActionError('')
      // 1. Delete from database
      const { error: dbError } = await supabase.from('gallery').delete().eq('id', item.id)
      if (dbError) throw dbError

      // 2. Attempt cleanup from Supabase Storage if it contains 'gallery-images'
      if (item.image_url && item.image_url.includes('gallery-images/')) {
        const parts = item.image_url.split('gallery-images/')
        if (parts.length > 1) {
          const filePath = parts[1]
          await supabase.storage.from('gallery-images').remove([filePath])
        }
      }

      setGalleryItems((prev) => prev.filter((g) => g.id !== item.id))
      setActionSuccess('Gallery item deleted.')
    } catch (err) {
      console.error('Error deleting gallery item:', err)
      setActionError('Failed to delete gallery item: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-darkText">
      {/* Top Admin Header */}
      <header className="bg-forest text-white border-b border-forest-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-moss rounded-lg text-forest">
                <BarChart3 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg leading-tight">Admin Dashboard</h1>
                <p className="text-[11px] text-moss uppercase tracking-wider font-semibold">
                  Society Clean-Up Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onNavigate('home')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Public Site</span>
              </button>

              <button
                onClick={fetchAllData}
                disabled={refreshing}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto py-2.5 border-t border-forest-light/60 scrollbar-none text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'reports', label: `Reports (${stats.totalReports})`, icon: AlertCircle },
              { id: 'volunteers', label: `Volunteers (${stats.totalVolunteers})`, icon: Users },
              { id: 'schedule', label: `Schedule (${schedules.length})`, icon: Calendar },
              { id: 'gallery', label: `Gallery (${galleryItems.length})`, icon: ImageIcon },
            ].map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-moss text-forest font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Notifications */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-lightGreen border border-moss text-forest flex items-center gap-3 text-sm font-bold shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm font-medium shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Live Statistics Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-forest">Live Database Statistics</h2>
                <span className="text-xs text-darkText/60 font-medium">Real-time counts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Total Volunteers */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-darkText/60 uppercase tracking-wider">Total Volunteers</p>
                    <p className="text-3xl font-black text-forest mt-1">{stats.totalVolunteers}</p>
                    <p className="text-xs text-moss font-semibold mt-1">Registered residents</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-lightGreen text-forest flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. Total Reports */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-darkText/60 uppercase tracking-wider">Total Reports</p>
                    <p className="text-3xl font-black text-forest mt-1">{stats.totalReports}</p>
                    <p className="text-xs text-darkText/60 font-medium mt-1">Submitted dirty spots</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>

                {/* 3. Pending Reports */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-darkText/60 uppercase tracking-wider">Pending Reports</p>
                    <p className="text-3xl font-black text-amber-600 mt-1">{stats.pendingReports}</p>
                    <p className="text-xs text-amber-700 font-medium mt-1">Awaiting clean-up</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                {/* 4. Cleaned Spots */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-darkText/60 uppercase tracking-wider">Cleaned Spots</p>
                    <p className="text-3xl font-black text-forest mt-1">{stats.cleanedSpots}</p>
                    <p className="text-xs text-forest font-semibold mt-1">Successfully resolved</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-lightGreen text-forest flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Pending Reports */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-forest text-base">Recent Pending Reports</h3>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                {reports.filter((r) => r.status === 'Pending').length === 0 ? (
                  <p className="text-sm text-darkText/60 py-6 text-center">No pending reports! All clear.</p>
                ) : (
                  <div className="space-y-3">
                    {reports
                      .filter((r) => r.status === 'Pending')
                      .slice(0, 4)
                      .map((report) => (
                        <div
                          key={report.id}
                          className="p-3.5 rounded-xl bg-lightGreen/40 border border-moss/20 flex items-center justify-between gap-3 text-left"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-forest truncate">{report.location}</p>
                            <p className="text-xs text-darkText/70 truncate">{report.description}</p>
                          </div>
                          <button
                            onClick={() => handleUpdateReportStatus(report.id, 'In Progress')}
                            className="px-2.5 py-1 text-xs font-bold bg-forest text-white rounded-lg hover:bg-forest-dark shrink-0 cursor-pointer"
                          >
                            Mark In Progress
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Latest Volunteers */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-forest text-base">Latest Volunteers</h3>
                  <button
                    onClick={() => setActiveTab('volunteers')}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                {volunteers.length === 0 ? (
                  <p className="text-sm text-darkText/60 py-6 text-center">No volunteers registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {volunteers.slice(0, 4).map((vol) => (
                      <div
                        key={vol.id}
                        className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 text-left"
                      >
                        <div>
                          <p className="text-sm font-bold text-darkText">{vol.name}</p>
                          <p className="text-xs text-darkText/60">Flat: {vol.flat_number} • Phone: {vol.phone}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-moss uppercase">Registered</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: REPORT MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-forest">Dirty Spot Reports Management</h2>
                <p className="text-xs text-darkText/60 mt-0.5">
                  Review reports submitted by residents and update progress status.
                </p>
              </div>
              <div className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                Total: {reports.length} reports
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <AlertCircle className="w-10 h-10 text-moss mx-auto mb-2" />
                <p className="font-bold text-forest">No dirty spots reported yet.</p>
                <p className="text-xs text-darkText/60 mt-1">Submitted reports will show up here automatically.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-darkText/70 uppercase">
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Description</th>
                        <th className="py-3.5 px-4">Submission Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-forest whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-moss shrink-0" />
                              <span>{report.location}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-darkText/80 max-w-xs break-words">
                            {report.description}
                          </td>
                          <td className="py-4 px-4 text-xs text-darkText/60 whitespace-nowrap">
                            {new Date(report.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                report.status === 'Cleaned'
                                  ? 'bg-lightGreen text-forest'
                                  : report.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Status update selector */}
                              <select
                                value={report.status}
                                onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                className="text-xs font-semibold py-1.5 px-2 bg-white border border-gray-300 rounded-lg text-darkText focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Cleaned">Cleaned</option>
                              </select>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                title="Delete Report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: VOLUNTEER MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-forest">Volunteer Management</h2>
                <p className="text-xs text-darkText/60 mt-0.5">
                  Private list of registered community helpers. Protected under database Row-Level Security.
                </p>
              </div>
              <div className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                Total Registered: {volunteers.length}
              </div>
            </div>

            {volunteers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Users className="w-10 h-10 text-moss mx-auto mb-2" />
                <p className="font-bold text-forest">No volunteers have registered yet.</p>
                <p className="text-xs text-darkText/60 mt-1">Registrations from the website will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-darkText/70 uppercase">
                        <th className="py-3.5 px-4">Name</th>
                        <th className="py-3.5 px-4">Flat Number</th>
                        <th className="py-3.5 px-4">Phone Number</th>
                        <th className="py-3.5 px-4">Registration Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {volunteers.map((vol) => (
                        <tr key={vol.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-forest whitespace-nowrap">
                            {vol.name}
                          </td>
                          <td className="py-4 px-4 text-darkText/90 font-medium whitespace-nowrap">
                            {vol.flat_number}
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-darkText whitespace-nowrap">
                            {vol.phone}
                          </td>
                          <td className="py-4 px-4 text-xs text-darkText/60 whitespace-nowrap">
                            {new Date(vol.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteVolunteer(vol.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Remove test or invalid volunteer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: SCHEDULE MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-forest">Schedule Management</h2>
                <p className="text-xs text-darkText/60 mt-0.5">
                  Manage clean-up drives. Confirmed schedules appear directly on the public website.
                </p>
              </div>
              <button
                onClick={() => handleOpenScheduleModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs sm:text-sm font-bold shadow-soft transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Clean-Up Schedule</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Calendar className="w-10 h-10 text-moss mx-auto mb-2" />
                <p className="font-bold text-forest">No schedule currently posted.</p>
                <p className="text-xs text-darkText/60 mt-1 mb-4">
                  The public website will display: "Clean-up schedule will be announced soon."
                </p>
                <button
                  onClick={() => handleOpenScheduleModal()}
                  className="px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold"
                >
                  Create First Schedule
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-forest bg-lightGreen px-2.5 py-1 rounded-full">
                          Drive Event
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenScheduleModal(item)}
                            className="p-1.5 text-darkText/60 hover:text-forest rounded-lg hover:bg-lightGreen cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div>
                          <span className="text-[11px] font-bold text-darkText/50 uppercase">Date</span>
                          <p className="text-base font-extrabold text-forest">{item.date}</p>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-darkText/50 uppercase">Time</span>
                          <p className="text-sm font-semibold text-darkText">{item.time}</p>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-darkText/50 uppercase">Meeting Point</span>
                          <p className="text-sm font-semibold text-darkText">{item.meeting_point}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] text-darkText/50">
                      Live on public website
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: GALLERY MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-forest">Before & After Gallery Management</h2>
                <p className="text-xs text-darkText/60 mt-0.5">
                  Upload photos to Supabase Storage and manage entries shown to society residents.
                </p>
              </div>
              <button
                onClick={handleOpenGalleryModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs sm:text-sm font-bold shadow-soft transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {galleryItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <ImageIcon className="w-10 h-10 text-moss mx-auto mb-2" />
                <p className="font-bold text-forest">No gallery photos uploaded yet.</p>
                <p className="text-xs text-darkText/60 mt-1 mb-4">
                  Add Before and After photos to show transformation results.
                </p>
                <button
                  onClick={handleOpenGalleryModal}
                  className="px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold"
                >
                  Upload First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <span
                          className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${
                            item.type === 'before'
                              ? 'bg-amber-600 text-white'
                              : 'bg-forest text-white'
                          }`}
                        >
                          {item.type === 'before' ? 'Before (Dirty)' : 'After (Clean)'}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-extrabold text-base text-forest">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-darkText/70 mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-darkText/50">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteGallery(item)}
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ==================================================================== */}
      {/* MODAL: SCHEDULE (ADD / EDIT) */}
      {/* ==================================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-moss/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-forest">
                {editingSchedule ? 'Edit Clean-Up Schedule' : 'Add Clean-Up Schedule'}
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-darkText/60 hover:text-darkText hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7:30 AM – 10:00 AM"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Meeting Point <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Society Clubhouse Lawn / Main Gate"
                  value={scheduleForm.meeting_point}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, meeting_point: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-darkText/70 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleSubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-forest hover:bg-forest-dark text-white shadow-soft transition-colors cursor-pointer"
                >
                  {scheduleSubmitting ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: GALLERY (UPLOAD / ADD) */}
      {/* ==================================================================== */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-moss/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-forest">Add Gallery Photo</h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded-lg text-darkText/60 hover:text-darkText hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Courtyard Transformation"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Category Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={galleryForm.type}
                  onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none bg-white font-medium"
                >
                  <option value="before">Before (Dirty Area)</option>
                  <option value="after">After (Clean Area)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Upload Image File (Supabase Storage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryFile(e.target.files[0] || null)}
                  className="w-full px-3 py-2 border border-dashed border-moss rounded-xl text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-lightGreen file:text-forest hover:file:bg-moss/30 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Or Image URL (Fallback)
                </label>
                <input
                  type="url"
                  placeholder="https://images.example.com/photo.jpg"
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest uppercase mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about the cleaning effort..."
                  value={galleryForm.description}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-darkText/70 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gallerySubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-forest hover:bg-forest-dark text-white shadow-soft transition-colors cursor-pointer"
                >
                  {gallerySubmitting ? 'Uploading...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
