import VirtualReceptionistDashboard from '@/components/voice-ai/VirtualReceptionistDashboard';

export default function VoiceAIPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voice AI Assistant</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor Shreya, the virtual receptionist for Sai Clinic
          </p>
        </div>

        <VirtualReceptionistDashboard />

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                24/7 automated phone answering
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Intelligent appointment scheduling
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Treatment information and pricing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Emergency call prioritization
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                SMS/WhatsApp confirmations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Multilingual support
              </li>
            </ul>
          </div>

          {/* Integration Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Integration Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">VAPI Voice AI</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">OpenAI GPT-4o</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deepgram Transcription</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calendar Integration</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SMS/WhatsApp</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Setup Instructions</h3>
          <div className="prose prose-blue text-sm">
            <p className="text-blue-800 mb-4">
              To complete the virtual receptionist setup, you'll need to configure the following:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Set up VAPI API key in environment variables (<code>VAPI_API_KEY</code>)</li>
              <li>Configure Google Calendar API for appointment scheduling</li>
              <li>Set up Twilio for SMS notifications (<code>TWILIO_ACCOUNT_SID</code>, <code>TWILIO_AUTH_TOKEN</code>)</li>
              <li>Configure WhatsApp Business API for messaging</li>
              <li>Set up webhook endpoints for real-time call handling</li>
              <li>Configure database tables for storing call logs and appointments</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}