'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/ui/Navbar'
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  venue: string
  max_participants: number
  registration_required: boolean
  registration_deadline: string
  image_url: string
  status: string
  created_by: string
  registration_status?: 'registered' | 'not_registered'
  participants_count?: number
}

export default function StudentEventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [registering, setRegistering] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterStatus])

  const fetchEvents = async () => {
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('college_id', user?.college_id)
        .order('event_date', { ascending: true })

      if (eventsError) throw eventsError

      // Fetch registration status for each event
      const eventsWithRegistration = await Promise.all(
        (eventsData || []).map(async (event) => {
          // Check if user is registered
          const { data: registrationData } = await supabase
            .from('event_registrations')
            .select('status')
            .eq('event_id', event.id)
            .eq('student_id', user?.id)
            .single()

          // Count total participants
          const { data: participantsData } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', event.id)
            .eq('status', 'registered')

          return {
            ...event,
            registration_status: registrationData ? 'registered' : 'not_registered',
            participants_count: participantsData?.length || 0
          }
        })
      )

      setEvents(eventsWithRegistration)

    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus)
    }

    setFilteredEvents(filtered)
  }

  const handleRegistration = async (eventId: string, action: 'register' | 'unregister') => {
    setRegistering(eventId)
    
    try {
      if (action === 'register') {
        const { error } = await supabase
          .from('event_registrations')
          .insert({
            event_id: eventId,
            student_id: user?.id,
            status: 'registered'
          })

        if (error) throw error
        toast.success('Successfully registered for event!')
      } else {
        const { error } = await supabase
          .from('event_registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('student_id', user?.id)

        if (error) throw error
        toast.success('Successfully unregistered from event!')
      }

      // Refresh events
      await fetchEvents()

    } catch (error) {
      console.error('Error with registration:', error)
      toast.error('Failed to update registration')
    } finally {
      setRegistering(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
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

  const isRegistrationOpen = (event: Event) => {
    if (!event.registration_required) return false
    if (event.status !== 'upcoming') return false
    if (event.registration_deadline) {
      return new Date(event.registration_deadline) > new Date()
    }
    return new Date(event.event_date) > new Date()
  }

  const isEventFull = (event: Event) => {
    return event.max_participants && event.participants_count >= event.max_participants
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">College Events</h1>
          <p className="text-gray-600">Discover and register for college events and activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                {/* Event Image */}
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {event.title}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(event.event_date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>

                    {event.registration_required && (
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {event.participants_count}
                        {event.max_participants && ` / ${event.max_participants}`} participants
                      </div>
                    )}
                  </div>

                  {/* Registration Status & Actions */}
                  {event.registration_required && (
                    <div className="border-t pt-4">
                      {event.registration_status === 'registered' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-600">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Registered</span>
                          </div>
                          <button
                            onClick={() => handleRegistration(event.id, 'unregister')}
                            disabled={registering === event.id}
                            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                          >
                            {registering === event.id ? 'Updating...' : 'Unregister'}
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isRegistrationOpen(event) ? (
                            <button
                              onClick={() => handleRegistration(event.id, 'register')}
                              disabled={registering === event.id || isEventFull(event)}
                              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                              {registering === event.id 
                                ? 'Registering...' 
                                : isEventFull(event) 
                                ? 'Event Full' 
                                : 'Register Now'
                              }
                            </button>
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              <span className="text-sm">Registration Closed</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'No events have been created yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}