import { NextRequest, NextResponse } from 'next/server';
import { AppointmentRequest } from '@/lib/types/voice-ai';

export async function POST(request: NextRequest) {
  try {
    const appointmentData: AppointmentRequest = await request.json();
    
    // Validate required fields
    if (!appointmentData.patientName || !appointmentData.contactNumber || 
        !appointmentData.preferredDate || !appointmentData.preferredTime) {
      return NextResponse.json(
        { error: 'Missing required appointment information' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Check calendar availability
    // 2. Create appointment in database
    // 3. Send confirmation SMS/WhatsApp
    // 4. Log the appointment request

    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock appointment creation
    const appointment = {
      id: appointmentId,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      clinicId: 'sai-clinic'
    };

    // TODO: Integrate with actual calendar system (Google Calendar, etc.)
    // TODO: Send SMS/WhatsApp confirmation
    // TODO: Store in database

    return NextResponse.json({
      success: true,
      appointment,
      message: `Appointment scheduled for ${appointmentData.patientName} on ${appointmentData.preferredDate} at ${appointmentData.preferredTime}`
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // Mock availability check
    const availableSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', 
      '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];

    return NextResponse.json({
      date: date || new Date().toISOString().split('T')[0],
      availableSlots,
      message: 'Available appointment slots retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}