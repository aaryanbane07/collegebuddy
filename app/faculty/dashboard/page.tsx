'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface FacultyStats {
  totalLectures: number
  upcomingLectures: number
  totalStudents: number
  averageAttendance: number
}

interface Lecture {
  id: string
  title: string
  subject: string
  scheduled_at: string
  room_number: string
  status: string
  attendance_count?: number
  total_students?: number
}

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<FacultyStats>({
    totalLectures: 0,
    upcomingLectures: 0,
    totalStudents: 0,
    averageAttendance: 0
  })
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([])
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateLecture, setShowCreateLecture] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch lectures created by this faculty
      const { data: lecturesData } = await supabase
        .from('lectures')
        .select('*')
        .eq('faculty_id', user?.id)
        .order('scheduled_at', { ascending: false })

      const totalLectures = lecturesData?.length || 0
      const upcomingCount = lecturesData?.filter(l => 
        new Date(l.scheduled_at) > new Date() && l.status !== 'cancelled'
      ).length || 0

      // Get recent lectures (last 5)
      const recent = lecturesData?.slice(0, 5) || []
      
      // Get upcoming lectures
      const upcoming = lecturesData?.filter(l => 
        new Date(l.scheduled_at) > new Date() && l.status !== 'cancelled'
      ).slice(0, 5) || []

      // Calculate attendance stats
      let totalAttendanceRecords = 0
      let presentCount = 0

      for (const lecture of lecturesData || []) {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status')
          .eq('lecture_id', lecture.id)

        totalAttendanceRecords += attendanceData?.length || 0
        presentCount += attendanceData?.filter(a => a.status === 'present').length || 0
      }

      const averageAttendance = totalAttendanceRecords > 0 
        ? Math.round((presentCount / totalAttendanceRecords) * 100) 
        : 0

      // Get unique students count
      const { data: studentsData } = await supabase
        .from('users')
        .select('id')
        .eq('college_name', user?.college_name)
        .eq('role', 'student')

      setStats({
        totalLectures,
        upcomingLectures: upcomingCount,
        totalStudents: studentsData?.length || 0,
        averageAttendance
      })

      setRecentLectures(recent)
      setUpcomingLectures(upcoming)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Faculty Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateLecture(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Lecture
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Lectures
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalLectures}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming Lectures
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.upcomingLectures}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg. Attendance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.averageAttendance}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Lectures */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Lectures</h3>
            </div>
            <div className="p-6">
              {recentLectures.length > 0 ? (
                <div className="space-y-4">
                  {recentLectures.map((lecture) => (
                    <div key={lecture.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lecture.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lecture.subject} • {lecture.room_number || 'Online'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(lecture.scheduled_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lecture.status)}`}>
                          {lecture.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No lectures created yet</p>
              )}
            </div>
          </div>

          {/* Upcoming Lectures */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Lectures</h3>
            </div>
            <div className="p-6">
              {upcomingLectures.length > 0 ? (
                <div className="space-y-4">
                  {upcomingLectures.map((lecture) => (
                    <div key={lecture.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lecture.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lecture.subject} • {lecture.room_number || 'Online'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(lecture.scheduled_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming lectures</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Create Lecture</p>
                  <p className="text-xs text-gray-500">Schedule a new lecture</p>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Upload Materials</p>
                  <p className="text-xs text-gray-500">Add notes and resources</p>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChartBarIcon className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">View Analytics</p>
                  <p className="text-xs text-gray-500">Check attendance reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}