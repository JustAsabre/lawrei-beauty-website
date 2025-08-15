import { db } from '../database';
import { bookings, customers, services } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  location?: string;
  reminders?: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
}

export interface CalendarResponse {
  success: boolean;
  eventId?: string;
  error?: string;
}

export class CalendarService {
  private static instance: CalendarService;
  private googleAuth: any;
  private calendar: any;
  private isConfigured: boolean = false;
  private calendarId: string;

  private constructor() {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.initializeGoogleCalendar();
  }

  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  private async initializeGoogleCalendar() {
    try {
      const { google } = await import('googleapis');
      
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

      if (clientId && clientSecret && refreshToken) {
        const oauth2Client = new google.auth.OAuth2(
          clientId,
          clientSecret,
          'urn:ietf:wg:oauth:2.0:oob'
        );

        oauth2Client.setCredentials({
          refresh_token: refreshToken
        });

        this.googleAuth = oauth2Client;
        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        this.isConfigured = true;
        console.log('Google Calendar service configured successfully');
      } else {
        console.warn('Google Calendar credentials not found, calendar service will be disabled');
        this.isConfigured = false;
      }
    } catch (error) {
      console.warn('Failed to initialize Google Calendar service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Create a calendar event for a booking
   */
  public async createBookingEvent(bookingId: string): Promise<CalendarResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Calendar service not configured'
      };
    }

    try {
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, bookingId),
        with: {
          customer: true,
          service: true
        }
      });

      if (!booking || !booking.customer || !booking.service) {
        return {
          success: false,
          error: 'Booking not found or incomplete'
        };
      }

      const startTime = new Date(booking.appointmentDate);
      const endTime = new Date(startTime.getTime() + (booking.service.duration * 60 * 1000));

      const event: CalendarEvent = {
        summary: `${booking.service.name} - ${booking.customer.name}`,
        description: `Appointment for ${booking.service.name}\nCustomer: ${booking.customer.name}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nNotes: ${booking.notes || 'No additional notes'}`,
        startTime,
        endTime,
        attendees: [booking.customer.email],
        location: process.env.BUSINESS_ADDRESS || 'Lawrei Beauty Salon',
        reminders: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      };

      const calendarEvent = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.startTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'UTC'
          },
          end: {
            dateTime: event.endTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'UTC'
          },
          attendees: event.attendees.map(email => ({ email })),
          location: event.location,
          reminders: {
            useDefault: false,
            overrides: event.reminders?.map(reminder => ({
              method: reminder.method,
              minutes: reminder.minutes
            }))
          }
        }
      });

      // Update booking with calendar event ID
      await db.update(bookings)
        .set({ calendarEventId: calendarEvent.data.id })
        .where(eq(bookings.id, bookingId));

      return {
        success: true,
        eventId: calendarEvent.data.id
      };
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update a calendar event when booking is modified
   */
  public async updateBookingEvent(bookingId: string): Promise<CalendarResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Calendar service not configured'
      };
    }

    try {
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, bookingId),
        with: {
          customer: true,
          service: true
        }
      });

      if (!booking || !booking.customer || !booking.service || !booking.calendarEventId) {
        return {
          success: false,
          error: 'Booking not found or missing calendar event ID'
        };
      }

      const startTime = new Date(booking.appointmentDate);
      const endTime = new Date(startTime.getTime() + (booking.service.duration * 60 * 1000));

      await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: booking.calendarEventId,
        requestBody: {
          summary: `${booking.service.name} - ${booking.customer.name}`,
          description: `Appointment for ${booking.service.name}\nCustomer: ${booking.customer.name}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nNotes: ${booking.notes || 'No additional notes'}`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'UTC'
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: process.env.TIMEZONE || 'UTC'
          },
          attendees: [{ email: booking.customer.email }],
          location: process.env.BUSINESS_ADDRESS || 'Lawrei Beauty Salon'
        }
      });

      return {
        success: true,
        eventId: booking.calendarEventId
      };
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete a calendar event when booking is cancelled
   */
  public async deleteBookingEvent(bookingId: string): Promise<CalendarResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Calendar service not configured'
      };
    }

    try {
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, bookingId)
      });

      if (!booking || !booking.calendarEventId) {
        return {
          success: false,
          error: 'Booking not found or missing calendar event ID'
        };
      }

      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: booking.calendarEventId
      });

      // Remove calendar event ID from booking
      await db.update(bookings)
        .set({ calendarEventId: null })
        .where(eq(bookings.id, bookingId));

      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get available time slots for a specific date
   */
  public async getAvailableSlots(date: string, serviceId: string): Promise<{ time: string; available: boolean }[]> {
    if (!this.isConfigured) {
      return [];
    }

    try {
      const service = await db.query.services.findFirst({
        where: eq(services.id, serviceId)
      });

      if (!service) {
        return [];
      }

      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      // Get business hours (configurable)
      const businessStart = 9; // 9 AM
      const businessEnd = 18; // 6 PM
      const slotDuration = 30; // 30 minutes

      const slots: { time: string; available: boolean }[] = [];

      for (let hour = businessStart; hour < businessEnd; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotTime = new Date(startDate);
          slotTime.setHours(hour, minute, 0, 0);

          const slotEndTime = new Date(slotTime.getTime() + (service.duration * 60 * 1000));

          // Check if slot overlaps with business hours
          if (slotEndTime.getHours() <= businessEnd) {
            const timeString = slotTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });

            // Check if slot conflicts with existing bookings
            const conflictingBooking = await db.query.bookings.findFirst({
              where: eq(bookings.serviceId, serviceId)
            });

            // For now, mark all slots as available (you can implement conflict checking)
            slots.push({
              time: timeString,
              available: true
            });
          }
        }
      }

      return slots;
    } catch (error) {
      console.error('Failed to get available slots:', error);
      return [];
    }
  }

  /**
   * Get calendar events for a date range
   */
  public async getEvents(startDate: Date, endDate: Date): Promise<any[]> {
    if (!this.isConfigured) {
      return [];
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      return [];
    }
  }

  /**
   * Check if calendar service is configured
   */
  public isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get service status
   */
  public getServiceStatus(): { configured: boolean; provider: string; calendarId: string } {
    return {
      configured: this.isConfigured,
      provider: this.isConfigured ? 'Google Calendar' : 'None',
      calendarId: this.calendarId
    };
  }
}

export default CalendarService;
