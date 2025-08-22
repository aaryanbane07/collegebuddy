export interface VoiceConfig {
  voiceId: string;
  provider: string;
}

export interface ModelConfig {
  model: string;
  messages: Message[];
  provider: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TranscriberConfig {
  model: string;
  language: string;
  provider: string;
}

export interface VirtualReceptionist {
  id: string;
  orgId: string;
  name: string;
  voice: VoiceConfig;
  createdAt: string;
  updatedAt: string;
  model: ModelConfig;
  firstMessage: string;
  voicemailMessage: string;
  endCallMessage: string;
  transcriber: TranscriberConfig;
  isServerUrlSecretSet: boolean;
}

export interface AppointmentRequest {
  patientName: string;
  contactNumber: string;
  preferredDate: string;
  preferredTime: string;
  treatmentType?: string;
  isUrgent?: boolean;
}

export interface CallSession {
  id: string;
  patientId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  callType: 'inquiry' | 'appointment' | 'emergency' | 'follow-up';
  status: 'active' | 'completed' | 'disconnected';
  transcript?: string;
  outcome?: string;
}