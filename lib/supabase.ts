import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  college_id: string
  full_name: string
  role: 'super_admin' | 'college_admin' | 'faculty' | 'student'
  college_name?: string
  department?: string
  year?: number
  phone?: string
  avatar_url?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface College {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  website?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Lecture {
  id: string
  title: string
  description?: string
  subject: string
  faculty_id: string
  college_id: string
  scheduled_at: string
  duration_minutes: number
  room_number?: string
  meeting_link?: string
  notes_url?: string
  video_url?: string
  attendance_required: boolean
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  college_id: string
  created_by: string
  event_date: string
  start_time: string
  end_time: string
  venue: string
  max_participants?: number
  registration_required: boolean
  registration_deadline?: string
  image_url?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  lecture_id: string
  student_id: string
  status: 'present' | 'absent' | 'late'
  marked_at: string
  marked_by: string
}

export interface EventRegistration {
  id: string
  event_id: string
  student_id: string
  registered_at: string
  status: 'registered' | 'attended' | 'cancelled'
}