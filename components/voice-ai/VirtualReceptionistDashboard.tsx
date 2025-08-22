'use client';

import { useState, useEffect } from 'react';
import { PhoneIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { VirtualReceptionist, CallSession } from '@/lib/types/voice-ai';
import { clinicInfo } from '@/lib/config/shreya-config';

interface DashboardProps {
  className?: string;
}

export default function VirtualReceptionistDashboard({ className = '' }: DashboardProps) {
  const [config, setConfig] = useState<VirtualReceptionist | null>(null);
  const [callSessions, setCallSessions] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCalls: 0,
    appointmentsBooked: 0,
    averageCallDuration: 0,
    activeNow: 0
  });

  useEffect(() => {
    fetchConfig();
    fetchCallSessions();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/voice-ai/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const fetchCallSessions = async () => {
    try {
      const response = await fetch('/api/voice-ai/calls');
      const data = await response.json();
      setCallSessions(data.sessions || []);
      
      // Calculate stats
      const total = data.sessions?.length || 0;
      const appointments = data.sessions?.filter((s: CallSession) => s.callType === 'appointment').length || 0;
      const active = data.sessions?.filter((s: CallSession) => s.status === 'active').length || 0;
      const avgDuration = data.sessions?.reduce((acc: number, s: CallSession) => acc + (s.duration || 0), 0) / total || 0;

      setStats({
        totalCalls: total,
        appointmentsBooked: appointments,
        averageCallDuration: Math.round(avgDuration),
        activeNow: active
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching call sessions:', error);
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Virtual Receptionist</h2>
            <p className="text-sm text-gray-600">Shreya - Sai Clinic Assistant</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
            <PhoneIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
          <div className="text-sm text-gray-600">Total Calls</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <CalendarIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.appointmentsBooked}</div>
          <div className="text-sm text-gray-600">Appointments</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatDuration(stats.averageCallDuration)}</div>
          <div className="text-sm text-gray-600">Avg Duration</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
            <UserIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeNow}</div>
          <div className="text-sm text-gray-600">Active Now</div>
        </div>
      </div>

      {/* Clinic Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Clinic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Operating Hours</h4>
            <p className="text-sm text-gray-600">Weekdays: {clinicInfo.timings.weekdays}</p>
            <p className="text-sm text-gray-600">Saturday: {clinicInfo.timings.saturday}</p>
            <p className="text-sm text-gray-600">Sunday: {clinicInfo.timings.sunday}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Contact</h4>
            <p className="text-sm text-gray-600">{clinicInfo.location.phone}</p>
            <p className="text-sm text-gray-600">{clinicInfo.location.email}</p>
            <p className="text-sm text-gray-600">Consultation: {clinicInfo.consultationFee}</p>
          </div>
        </div>
      </div>

      {/* Recent Call Sessions */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Call Sessions</h3>
        <div className="space-y-3">
          {callSessions.length > 0 ? (
            callSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    session.status === 'active' ? 'bg-green-400' :
                    session.status === 'completed' ? 'bg-blue-400' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.callType.charAt(0).toUpperCase() + session.callType.slice(1)} Call
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 capitalize">{session.status}</p>
                  {session.duration && (
                    <p className="text-xs text-gray-600">{formatDuration(session.duration)}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PhoneIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No call sessions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Status */}
      {config && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Status</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Voice Model:</span>
                <span className="ml-2 font-medium">{config.voice.voiceId} ({config.voice.provider})</span>
              </div>
              <div>
                <span className="text-gray-600">AI Model:</span>
                <span className="ml-2 font-medium">{config.model.model}</span>
              </div>
              <div>
                <span className="text-gray-600">Transcriber:</span>
                <span className="ml-2 font-medium">{config.transcriber.model} ({config.transcriber.provider})</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 font-medium">{new Date(config.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}