import { VirtualReceptionist, CallSession } from '../types/voice-ai';
import { shreyaConfig } from '../config/shreya-config';

export class VoiceAIService {
  private static readonly VAPI_BASE_URL = 'https://api.vapi.ai';
  private static apiKey: string | null = null;

  /**
   * Initialize the Voice AI service with API key
   */
  static initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Create a new voice AI assistant
   */
  static async createAssistant(config: VirtualReceptionist): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI API key not initialized');
    }

    try {
      const response = await fetch(`${this.VAPI_BASE_URL}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          name: config.name,
          model: config.model,
          voice: config.voice,
          firstMessage: config.firstMessage,
          voicemailMessage: config.voicemailMessage,
          endCallMessage: config.endCallMessage,
          transcriber: config.transcriber
        })
      });

      if (!response.ok) {
        throw new Error(`VAPI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating VAPI assistant:', error);
      throw error;
    }
  }

  /**
   * Start a phone call with the virtual receptionist
   */
  static async initiateCall(phoneNumber: string, assistantId?: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI API key not initialized');
    }

    try {
      const response = await fetch(`${this.VAPI_BASE_URL}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          phoneNumberId: phoneNumber,
          assistantId: assistantId || shreyaConfig.id,
          assistant: assistantId ? undefined : {
            name: shreyaConfig.name,
            model: shreyaConfig.model,
            voice: shreyaConfig.voice,
            firstMessage: shreyaConfig.firstMessage,
            voicemailMessage: shreyaConfig.voicemailMessage,
            endCallMessage: shreyaConfig.endCallMessage,
            transcriber: shreyaConfig.transcriber
          }
        })
      });

      if (!response.ok) {
        throw new Error(`VAPI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initiating VAPI call:', error);
      throw error;
    }
  }

  /**
   * Get call details from VAPI
   */
  static async getCallDetails(callId: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI API key not initialized');
    }

    try {
      const response = await fetch(`${this.VAPI_BASE_URL}/call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`VAPI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching call details:', error);
      throw error;
    }
  }

  /**
   * Handle webhook from VAPI for call events
   */
  static async handleWebhook(payload: any): Promise<void> {
    try {
      const { type, call } = payload;

      switch (type) {
        case 'call-started':
          console.log(`Call started: ${call.id}`);
          // TODO: Log call start in database
          break;

        case 'call-ended':
          console.log(`Call ended: ${call.id}`);
          // TODO: Log call end and transcript in database
          break;

        case 'function-call':
          // Handle function calls from the AI (e.g., booking appointments)
          await this.handleFunctionCall(payload);
          break;

        default:
          console.log(`Unhandled webhook type: ${type}`);
      }
    } catch (error) {
      console.error('Error handling VAPI webhook:', error);
      throw error;
    }
  }

  /**
   * Handle function calls from the AI assistant
   */
  private static async handleFunctionCall(payload: any): Promise<void> {
    const { functionCall, call } = payload;
    
    try {
      switch (functionCall.name) {
        case 'bookAppointment':
          const appointmentData = functionCall.parameters;
          // TODO: Process appointment booking
          console.log('Booking appointment:', appointmentData);
          break;

        case 'checkAvailability':
          const { date } = functionCall.parameters;
          // TODO: Check calendar availability
          console.log('Checking availability for:', date);
          break;

        case 'sendConfirmation':
          const { contactNumber, appointmentDetails } = functionCall.parameters;
          // TODO: Send SMS/WhatsApp confirmation
          console.log('Sending confirmation to:', contactNumber);
          break;

        default:
          console.log(`Unhandled function call: ${functionCall.name}`);
      }
    } catch (error) {
      console.error('Error handling function call:', error);
    }
  }

  /**
   * Get Shreya configuration
   */
  static getConfig(): VirtualReceptionist {
    return shreyaConfig;
  }

  /**
   * Update Shreya configuration
   */
  static async updateConfig(updates: Partial<VirtualReceptionist>): Promise<VirtualReceptionist> {
    // TODO: Update configuration in database
    // For now, return merged config
    return {
      ...shreyaConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }
}