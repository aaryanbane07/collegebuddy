import { NextRequest, NextResponse } from 'next/server';
import { VoiceAIService } from '@/lib/services/voice-ai-service';
import { CalendarService } from '@/lib/services/calendar-service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Verify webhook signature (implement based on VAPI documentation)
    // const signature = request.headers.get('x-vapi-signature');
    // if (!verifySignature(payload, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { type, call, functionCall } = payload;

    switch (type) {
      case 'call-started':
        console.log(`Voice AI call started: ${call.id}`);
        break;

      case 'call-ended':
        console.log(`Voice AI call ended: ${call.id}`);
        // TODO: Store call transcript and summary
        break;

      case 'function-call':
        await handleFunctionCall(functionCall, call);
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error handling VAPI webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleFunctionCall(functionCall: any, call: any) {
  try {
    switch (functionCall.name) {
      case 'bookAppointment':
        const appointmentData = functionCall.parameters;
        const appointment = await CalendarService.bookAppointment(appointmentData);
        
        // Send confirmation
        await CalendarService.sendConfirmation(appointment);
        
        console.log('Appointment booked successfully:', appointment.id);
        break;

      case 'checkAvailability':
        const { date } = functionCall.parameters;
        const slots = await CalendarService.getAvailableSlots(date);
        
        console.log(`Available slots for ${date}:`, slots.length);
        break;

      case 'getClinicInfo':
        // Return clinic information to the AI
        const { clinicInfo } = await import('@/lib/config/shreya-config');
        console.log('Clinic info requested:', clinicInfo.name);
        break;

      default:
        console.log(`Unhandled function call: ${functionCall.name}`);
    }
  } catch (error) {
    console.error('Error handling function call:', error);
  }
}

// Helper function to verify webhook signature (implement based on VAPI docs)
function verifySignature(payload: any, signature: string | null): boolean {
  // TODO: Implement signature verification
  return true; // For now, accept all webhooks
}