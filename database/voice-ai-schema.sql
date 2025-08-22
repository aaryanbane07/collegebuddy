-- Voice AI Virtual Receptionist Database Schema
-- This schema extends the existing COLLEGEBUDDY database with voice AI functionality

-- Virtual Receptionist Configurations
CREATE TABLE IF NOT EXISTS virtual_receptionists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    voice_config JSONB NOT NULL,
    model_config JSONB NOT NULL,
    transcriber_config JSONB NOT NULL,
    first_message TEXT,
    voicemail_message TEXT,
    end_call_message TEXT,
    is_active BOOLEAN DEFAULT true,
    is_server_url_secret_set BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Sessions
CREATE TABLE IF NOT EXISTS call_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vapi_call_id VARCHAR(255) UNIQUE,
    receptionist_id UUID REFERENCES virtual_receptionists(id),
    patient_id UUID,
    caller_phone VARCHAR(20),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    call_type VARCHAR(50) CHECK (call_type IN ('inquiry', 'appointment', 'emergency', 'follow-up')),
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'disconnected', 'failed')),
    transcript TEXT,
    summary TEXT,
    outcome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients (for clinic management)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    call_session_id UUID REFERENCES call_sessions(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30, -- in minutes
    treatment_type VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no-show')),
    is_urgent BOOLEAN DEFAULT false,
    notes TEXT,
    consultation_fee DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function Calls (AI actions during calls)
CREATE TABLE IF NOT EXISTS function_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_session_id UUID REFERENCES call_sessions(id),
    function_name VARCHAR(255) NOT NULL,
    parameters JSONB,
    response JSONB,
    execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- Clinic Information
CREATE TABLE IF NOT EXISTS clinic_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    operating_hours JSONB,
    services JSONB,
    consultation_fee DECIMAL(10,2),
    emergency_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications/Messages
CREATE TABLE IF NOT EXISTS voice_ai_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    type VARCHAR(50) CHECK (type IN ('confirmation', 'reminder', 'cancellation', 'follow-up')),
    channel VARCHAR(20) CHECK (channel IN ('sms', 'whatsapp', 'email', 'call')),
    message TEXT,
    phone_number VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_call_sessions_start_time ON call_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_caller_phone ON call_sessions(caller_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON voice_ai_notifications(status);

-- Row Level Security (RLS) Policies
ALTER TABLE virtual_receptionists ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE function_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_ai_notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your authentication system)
CREATE POLICY "Allow authenticated users to read virtual_receptionists" ON virtual_receptionists
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage call_sessions" ON call_sessions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage patients" ON patients
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage appointments" ON appointments
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default clinic information
INSERT INTO clinic_info (name, type, address, phone, email, operating_hours, services, consultation_fee, emergency_available)
VALUES (
    'Sai Clinic',
    'Dental Clinic',
    '123 Main Street, City, State 12345',
    '+1-234-567-8900',
    'info@saiclinic.com',
    '{"weekdays": "9:00 AM - 6:00 PM", "saturday": "9:00 AM - 2:00 PM", "sunday": "Closed"}',
    '["Dental Cleaning", "Fillings", "Root Canal", "Braces", "Dental Implants", "Teeth Whitening", "Oral Surgery", "Emergency Dental Care"]',
    50.00,
    true
) ON CONFLICT DO NOTHING;

-- Insert Shreya configuration
INSERT INTO virtual_receptionists (
    id, org_id, name, voice_config, model_config, transcriber_config, 
    first_message, voicemail_message, end_call_message
)
VALUES (
    'a80f5f65-73a6-4a34-8461-04edd66cd33d',
    '902a1bc6-579f-453a-b576-8d7f4a4d66c3',
    'Shreya',
    '{"voiceId": "Elliot", "provider": "vapi"}',
    '{"model": "gpt-4o", "provider": "openai", "messages": [{"role": "system", "content": "You are Shreya, a virtual receptionist for Sai Clinic..."}]}',
    '{"model": "nova-2", "language": "en", "provider": "deepgram"}',
    'Hello.',
    'Please call back when you''re available.',
    'Goodbye.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    voice_config = EXCLUDED.voice_config,
    model_config = EXCLUDED.model_config,
    transcriber_config = EXCLUDED.transcriber_config,
    updated_at = NOW();