import { db } from '../database';
import { bookings, customers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SMSService {
  private static instance: SMSService;
  private twilioClient: any;
  private isConfigured: boolean = false;

  private constructor() {
    this.initializeTwilio();
  }

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  private async initializeTwilio() {
    try {
      const { default: twilio } = await import('twilio');
      
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (accountSid && authToken && phoneNumber) {
        this.twilioClient = twilio(accountSid, authToken);
        this.isConfigured = true;
        console.log('Twilio SMS service configured successfully');
      } else {
        console.warn('Twilio credentials not found, SMS service will be disabled');
        this.isConfigured = false;
      }
    } catch (error) {
      console.warn('Failed to initialize Twilio SMS service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send an SMS message
   */
  public async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'SMS service not configured'
      };
    }

    try {
      const twilioMessage = await this.twilioClient.messages.create({
        body: message.body,
        from: message.from || process.env.TWILIO_PHONE_NUMBER,
        to: message.to
      });

      return {
        success: true,
        messageId: twilioMessage.sid
      };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send appointment confirmation SMS
   */
  public async sendAppointmentConfirmation(bookingId: string): Promise<SMSResponse> {
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

      const message = `Hi ${booking.customer.name}! Your appointment for ${booking.service.name} is confirmed for ${new Date(booking.appointmentDate).toLocaleDateString()} at ${new Date(booking.appointmentDate).toLocaleTimeString()}. See you soon! - Lawrei Beauty`;

      return await this.sendSMS({
        to: booking.customer.phone,
        body: message
      });
    } catch (error) {
      console.error('Failed to send appointment confirmation SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send appointment reminder SMS (24 hours before)
   */
  public async sendAppointmentReminder(bookingId: string): Promise<SMSResponse> {
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

      const message = `Reminder: Your ${booking.service.name} appointment is tomorrow at ${new Date(booking.appointmentDate).toLocaleTimeString()}. Please arrive 10 minutes early. - Lawrei Beauty`;

      return await this.sendSMS({
        to: booking.customer.phone,
        body: message
      });
    } catch (error) {
      console.error('Failed to send appointment reminder SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send appointment cancellation SMS
   */
  public async sendAppointmentCancellation(bookingId: string, reason?: string): Promise<SMSResponse> {
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

      const reasonText = reason ? ` Reason: ${reason}` : '';
      const message = `Hi ${booking.customer.name}, your ${booking.service.name} appointment has been cancelled.${reasonText} Please contact us to reschedule. - Lawrei Beauty`;

      return await this.sendSMS({
        to: booking.customer.phone,
        body: message
      });
    } catch (error) {
      console.error('Failed to send appointment cancellation SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send payment confirmation SMS
   */
  public async sendPaymentConfirmation(bookingId: string): Promise<SMSResponse> {
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

      const amount = (booking.totalPrice / 100).toFixed(2);
      const message = `Payment confirmed! Your ${booking.service.name} appointment is fully paid. Amount: $${amount}. See you on ${new Date(booking.appointmentDate).toLocaleDateString()}. - Lawrei Beauty`;

      return await this.sendSMS({
        to: booking.customer.phone,
        body: message
      });
    } catch (error) {
      console.error('Failed to send payment confirmation SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send welcome SMS to new customers
   */
  public async sendWelcomeSMS(customerId: string): Promise<SMSResponse> {
    try {
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, customerId)
      });

      if (!customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      const message = `Welcome to Lawrei Beauty, ${customer.name}! Thank you for choosing us. We're excited to help you look and feel your best. Book your first appointment today! - Lawrei Beauty`;

      return await this.sendSMS({
        to: customer.phone,
        body: message
      });
    } catch (error) {
      console.error('Failed to send welcome SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if SMS service is configured
   */
  public isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get service status
   */
  public getServiceStatus(): { configured: boolean; provider: string } {
    return {
      configured: this.isConfigured,
      provider: this.isConfigured ? 'Twilio' : 'None'
    };
  }
}

export default SMSService;
