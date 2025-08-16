'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalLectures: number
  attendancePercentage: number
  upcomingEvents: number
  completedEvents: number
}

interface UpcomingLecture {
  id: string
  title: string
  subject: string
  scheduled_at: string
  room_number: string
  faculty_name: string
}

interface RecentEvent {
  id: string
  title: string
  event_date: string
  venue: string
  status: string
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalLectures: 0,
    attendancePercentage: 0,
    upcomingEvents: 0,
    completedEvents: 0
  })
  const [upcomingLectures, setUpcomingLectures] = useState<UpcomingLecture[]>([])
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch attendance stats
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', user?.id)

      const totalLectures = attendanceData?.length || 0
      const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0
      const attendancePercentage = totalLectures > 0 ? Math.round((presentCount / totalLectures) * 100) : 0

      // Fetch upcoming lectures
      const { data: lecturesData } = await supabase
        .from('lectures')
        .select(`
          id,
          title,
          subject,
          scheduled_at,
          room_number,
          users!lectures_faculty_id_fkey(full_name)
        `)
        .eq('college_id', user?.college_id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5)

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title, event_date, venue, status')
        .eq('college_id', user?.college_id)
        .order('event_date', { ascending: false })
        .limit(5)

      const upcomingEvents = eventsData?.filter(e => e.status === 'upcoming').length || 0
      const completedEvents = eventsData?.filter(e => e.status === 'completed').length || 0

      setStats({
        totalLectures,
        attendancePercentage,
        upcomingEvents,
        completedEvents
      })

      setUpcomingLectures(lecturesData?.map(lecture => ({
        id: lecture.id,
        title: lecture.title,
        subject: lecture.subject,
        scheduled_at: lecture.scheduled_at,
        room_number: lecture.room_number || 'TBA',
        faculty_name: lecture.users?.full_name || 'Unknown'
      })) || [])

      setRecentEvents(eventsData || [])

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
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-gray-600">Here's what's happening today</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
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
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Attendance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.attendancePercentage}%
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
                      Upcoming Events
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.upcomingEvents}
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
                      Events Attended
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.completedEvents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          {lecture.subject} • {lecture.faculty_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(lecture.scheduled_at)} • {lecture.room_number}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming lectures</p>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(event.event_date)} • {event.venue}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800'
                            : event.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}