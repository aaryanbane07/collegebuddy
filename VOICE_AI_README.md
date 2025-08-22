# 🎙️ Shreya Virtual Receptionist

## Overview

Shreya is an AI-powered virtual receptionist integrated into the COLLEGEBUDDY platform, specifically designed for Sai Clinic. She handles incoming calls, manages appointment bookings, and provides information about dental treatments and clinic services.

## Features

### 🤖 AI-Powered Conversations
- **Natural Language Processing**: Powered by OpenAI GPT-4o
- **Voice Synthesis**: VAPI with Elliot voice model
- **Speech Recognition**: Deepgram Nova-2 transcription
- **Multi-language Support**: Configurable language settings

### 📞 Call Management
- **24/7 Availability**: Automated phone answering
- **Call Routing**: Intelligent call type detection
- **Emergency Handling**: Priority routing for urgent cases
- **Call Analytics**: Detailed session tracking and reporting

### 📅 Appointment Scheduling
- **Real-time Availability**: Calendar integration
- **Automatic Booking**: AI-driven appointment scheduling
- **Confirmation System**: SMS/WhatsApp notifications
- **Reminder Service**: Automated appointment reminders

### 🏥 Clinic Integration
- **Treatment Information**: Comprehensive service details
- **Pricing Information**: Consultation fees and treatment costs
- **Operating Hours**: Dynamic schedule management
- **Location Services**: Directions and contact information

## Technical Architecture

### API Endpoints

#### Configuration Management
- `GET /api/voice-ai/config` - Retrieve Shreya configuration
- `PUT /api/voice-ai/config` - Update configuration settings

#### Call Session Management
- `POST /api/voice-ai/calls` - Start new call session
- `GET /api/voice-ai/calls` - Retrieve call sessions
- `PUT /api/voice-ai/calls` - Update call session status

#### Appointment Handling
- `POST /api/voice-ai/appointments` - Book new appointment
- `GET /api/voice-ai/appointments` - Check availability

#### Webhook Integration
- `POST /api/voice-ai/webhook` - VAPI webhook handler

### Database Schema

The system includes dedicated tables for:
- **virtual_receptionists**: AI configuration storage
- **call_sessions**: Call tracking and analytics
- **patients**: Patient information management
- **appointments**: Appointment scheduling
- **function_calls**: AI action logging
- **clinic_info**: Clinic details and services
- **voice_ai_notifications**: Message delivery tracking

### Services

#### VoiceAIService
- VAPI integration and call management
- Assistant configuration and updates
- Webhook event handling

#### CalendarService
- Appointment scheduling and availability
- Time slot management
- Confirmation and reminder system

## Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env.local` file:

```env
# Voice AI Configuration
VAPI_API_KEY=your_vapi_api_key
VAPI_WEBHOOK_SECRET=your_vapi_webhook_secret

# Google Calendar Integration
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_REFRESH_TOKEN=your_google_refresh_token

# SMS/WhatsApp Integration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# WhatsApp Business API
WHATSAPP_BUSINESS_PHONE_ID=your_whatsapp_phone_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
```

### 2. Database Setup

Run the SQL schema in your Supabase dashboard:

```bash
# Execute the voice AI schema
psql -h your-supabase-host -U postgres -d postgres -f database/voice-ai-schema.sql
```

### 3. VAPI Configuration

1. Sign up for a VAPI account at [vapi.ai](https://vapi.ai)
2. Create a new assistant with the Shreya configuration
3. Set up webhook endpoints pointing to your application
4. Configure phone number for incoming calls

### 4. Calendar Integration

1. Create a Google Cloud Project
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Generate refresh token for calendar access

### 5. SMS/WhatsApp Setup

1. Create a Twilio account
2. Purchase a phone number for SMS
3. Set up WhatsApp Business API (optional)
4. Configure webhook endpoints

## Usage

### Accessing the Dashboard

Navigate to `/voice-ai` in your application to view the virtual receptionist dashboard.

### Making Test Calls

Use the VAPI dashboard or API to initiate test calls to your configured phone number.

### Monitoring Performance

The dashboard provides real-time analytics including:
- Total calls handled
- Appointments booked
- Average call duration
- Active call sessions

## Configuration

### Shreya's Personality

Shreya is configured with:
- **Professional demeanor**: Warm, friendly, and caring
- **Clear communication**: Simple language, no medical jargon
- **Active listening**: Confirmation and clarification techniques
- **Comprehensive assistance**: Full clinic information and services

### Clinic Information

Current configuration includes:
- **Operating Hours**: Weekdays 9 AM - 6 PM, Saturday 9 AM - 2 PM
- **Services**: Full range of dental treatments
- **Consultation Fee**: $50
- **Emergency Support**: Available for urgent cases

## Customization

### Updating Shreya's Responses

Modify the system message in `lib/config/shreya-config.ts` to customize:
- Greeting messages
- Response style and tone
- Available information
- Error handling approaches

### Adding New Functions

Extend the AI's capabilities by:
1. Adding new function definitions to the model configuration
2. Implementing handlers in the webhook endpoint
3. Creating corresponding API routes for data management

### Clinic Information Updates

Update clinic details in:
- `lib/config/shreya-config.ts` for runtime configuration
- `database/voice-ai-schema.sql` for database defaults

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Verify webhook URL is publicly accessible
   - Check VAPI webhook configuration
   - Validate webhook signature verification

2. **Calendar Integration Failures**
   - Verify Google Calendar API credentials
   - Check refresh token validity
   - Ensure proper OAuth scopes

3. **SMS/WhatsApp Not Sending**
   - Validate Twilio credentials
   - Check phone number format
   - Verify webhook endpoints

### Debugging

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=voice-ai:*
```

## Security Considerations

- **Webhook Signature Verification**: Validate all incoming webhooks
- **Data Encryption**: Encrypt sensitive patient information
- **Access Control**: Implement proper RLS policies
- **Rate Limiting**: Prevent API abuse
- **HIPAA Compliance**: Ensure medical data protection

## Future Enhancements

- **Multi-language Support**: Expand language capabilities
- **Advanced Analytics**: Machine learning insights
- **Integration Expansion**: EHR and practice management systems
- **Mobile App**: Dedicated mobile interface
- **Voice Biometrics**: Patient identification through voice

---

For technical support or questions, refer to the main project documentation or create an issue in the repository.