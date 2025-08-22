import { AppointmentRequest } from '../types/voice-ai';

export interface TimeSlot {
  time: string;
  available: boolean;
  duration: number; // in minutes
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  patientName: string;
  contactNumber: string;
  treatmentType?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export class CalendarService {
  // Mock clinic hours - in a real implementation, this would come from configuration
  private static readonly CLINIC_HOURS = {
    weekdays: { start: '09:00', end: '18:00' },
    saturday: { start: '09:00', end: '14:00' },
    sunday: null // Closed
  };

  private static readonly APPOINTMENT_DURATION = 30; // minutes

  /**
   * Check availability for a specific date
   */
  static async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    try {
      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0; // Sunday
      const isSaturday = dayOfWeek === 6;

      if (isWeekend) {
        return []; // Closed on Sunday
      }

      const hours = isSaturday 
        ? this.CLINIC_HOURS.saturday 
        : this.CLINIC_HOURS.weekdays;

      if (!hours) return [];

      // Generate time slots
      const slots: TimeSlot[] = [];
      const startHour = parseInt(hours.start.split(':')[0]);
      const endHour = parseInt(hours.end.split(':')[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        // Skip lunch break (12-1 PM)
        if (hour === 12) continue;

        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true, // TODO: Check against existing appointments
          duration: this.APPOINTMENT_DURATION
        });

        // Add 30-minute slot if not the last hour
        if (hour < endHour - 1) {
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:30`,
            available: true,
            duration: this.APPOINTMENT_DURATION
          });
        }
      }

      // TODO: Filter out already booked slots from database
      return slots;

    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error('Failed to fetch available slots');
    }
  }

  /**
   * Book an appointment
   */
  static async bookAppointment(appointmentData: AppointmentRequest): Promise<CalendarEvent> {
    try {
      // TODO: Validate slot availability
      // TODO: Create event in Google Calendar or other calendar system
      // TODO: Store in database

      const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const event: CalendarEvent = {
        id: appointmentId,
        title: `Dental Appointment - ${appointmentData.patientName}`,
        start: `${appointmentData.preferredDate}T${this.convertTo24Hour(appointmentData.preferredTime)}`,
        end: `${appointmentData.preferredDate}T${this.addMinutes(appointmentData.preferredTime, this.APPOINTMENT_DURATION)}`,
        patientName: appointmentData.patientName,
        contactNumber: appointmentData.contactNumber,
        treatmentType: appointmentData.treatmentType,
        status: appointmentData.isUrgent ? 'confirmed' : 'scheduled'
      };

      return event;

    } catch (error) {
      console.error('Error booking appointment:', error);
      throw new Error('Failed to book appointment');
    }
  }

  /**
   * Convert 12-hour time format to 24-hour format
   */
  private static convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes || '00'}:00`;
  }

  /**
   * Add minutes to a time string
   */
  private static addMinutes(timeStr: string, minutes: number): string {
    const time24 = this.convertTo24Hour(timeStr);
    const [hours, mins] = time24.split(':').map(Number);
    
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}:00`;
  }

  /**
   * Send appointment confirmation
   */
  static async sendConfirmation(appointment: CalendarEvent): Promise<boolean> {
    try {
      // TODO: Implement SMS/WhatsApp API integration
      // TODO: Send email confirmation
      
      console.log(`Sending confirmation to ${appointment.contactNumber} for appointment on ${appointment.start}`);
      
      return true;
    } catch (error) {
      console.error('Error sending confirmation:', error);
      return false;
    }
  }

  /**
   * Send appointment reminder
   */
  static async sendReminder(appointment: CalendarEvent): Promise<boolean> {
    try {
      // TODO: Implement reminder system
      
      console.log(`Sending reminder to ${appointment.contactNumber} for appointment tomorrow`);
      
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      return false;
    }
  }
}