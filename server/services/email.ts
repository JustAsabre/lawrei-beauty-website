import nodemailer from 'nodemailer';
import { db } from '../database';
import { bookings, customers, services } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export class EmailService {
  private static transporter: nodemailer.Transporter;

  /**
   * Initialize email transporter
   */
  static initialize() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send booking confirmation email
   */
  static async sendBookingConfirmation(bookingId: string) {
    try {
      if (!this.transporter) {
        this.initialize();
      }

      // Get booking details
      const bookingData = await db
        .select({
          id: bookings.id,
          appointmentDate: bookings.appointmentDate,
          startTime: bookings.startTime,
          totalPrice: bookings.totalPrice,
          notes: bookings.notes,
          customerFirstName: customers.firstName,
          customerLastName: customers.lastName,
          customerEmail: customers.email,
          serviceName: services.name,
          serviceDuration: services.duration,
        })
        .from(bookings)
        .leftJoin(customers, eq(bookings.customerId, customers.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (bookingData.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingData[0];
      const appointmentDate = new Date(booking.appointmentDate);
      const startTime = new Date(booking.startTime);

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Lawrei Beauty</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Beauty Journey Begins Here</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">🎉 Booking Confirmation</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear ${booking.customerFirstName} ${booking.customerLastName},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for choosing Lawrei Beauty! Your appointment has been confirmed and we're excited to help you look and feel your best.
            </p>
            
            <div style="background: white; border-radius: 10px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Appointment Details</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <strong style="color: #333;">Service:</strong><br>
                  <span style="color: #666;">${booking.serviceName}</span>
                </div>
                <div>
                  <strong style="color: #333;">Duration:</strong><br>
                  <span style="color: #666;">${booking.serviceDuration} minutes</span>
                </div>
                <div>
                  <strong style="color: #333;">Date:</strong><br>
                  <span style="color: #666;">${appointmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div>
                  <strong style="color: #333;">Time:</strong><br>
                  <span style="color: #666;">${startTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}</span>
                </div>
              </div>
              
              <div style="text-align: center; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <strong style="color: #333; font-size: 18px;">Total Amount: $${(booking.totalPrice / 100).toFixed(2)}</strong>
              </div>
              
              ${booking.notes ? `
                <div style="margin-top: 20px;">
                  <strong style="color: #333;">Special Requests:</strong><br>
                  <span style="color: #666; font-style: italic;">${booking.notes}</span>
                </div>
              ` : ''}
            </div>
            
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #155724; margin: 0 0 10px 0;">📋 What to Expect</h4>
              <ul style="color: #155724; margin: 0; padding-left: 20px;">
                <li>Arrive 10 minutes before your appointment</li>
                <li>Bring any relevant medical information</li>
                <li>Wear comfortable clothing</li>
                <li>Stay hydrated before your session</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Cancellation Policy</h4>
              <p style="color: #856404; margin: 0; font-size: 14px;">
                Please provide at least 24 hours notice if you need to cancel or reschedule your appointment.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:info@lawrei-beauty.com" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Contact Us
              </a>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Lawrei Beauty. All rights reserved.<br>
              This email was sent to ${booking.customerEmail}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@lawrei-beauty.com',
        to: booking.customerEmail,
        subject: `Booking Confirmation - ${booking.serviceName} - Lawrei Beauty`,
        html: emailContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Booking confirmation email sent to ${booking.customerEmail}:`, result.messageId);
      
      return result;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmation(bookingId: string) {
    try {
      if (!this.transporter) {
        this.initialize();
      }

      // Get booking details
      const bookingData = await db
        .select({
          id: bookings.id,
          appointmentDate: bookings.appointmentDate,
          startTime: bookings.startTime,
          totalPrice: bookings.totalPrice,
          customerFirstName: customers.firstName,
          customerLastName: customers.lastName,
          customerEmail: customers.email,
          serviceName: services.name,
        })
        .from(bookings)
        .leftJoin(customers, eq(bookings.customerId, customers.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (bookingData.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingData[0];
      const appointmentDate = new Date(booking.appointmentDate);
      const startTime = new Date(booking.startTime);

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Lawrei Beauty</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Payment Confirmed</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">💳 Payment Confirmed!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear ${booking.customerFirstName} ${booking.customerLastName},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your payment has been processed successfully and your appointment is now fully confirmed.
            </p>
            
            <div style="background: white; border-radius: 10px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Payment Summary</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <strong style="color: #333;">Service:</strong><br>
                  <span style="color: #666;">${booking.serviceName}</span>
                </div>
                <div>
                  <strong style="color: #333;">Amount Paid:</strong><br>
                  <span style="color: #28a745; font-weight: bold; font-size: 18px;">$${(booking.totalPrice / 100).toFixed(2)}</span>
                </div>
                <div>
                  <strong style="color: #333;">Date:</strong><br>
                  <span style="color: #666;">${appointmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div>
                  <strong style="color: #333;">Time:</strong><br>
                  <span style="color: #666;">${startTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}</span>
                </div>
              </div>
              
              <div style="text-align: center; background: #d4edda; padding: 15px; border-radius: 8px; border: 1px solid #c3e6cb;">
                <strong style="color: #155724; font-size: 18px;">✅ Payment Status: Confirmed</strong>
              </div>
            </div>
            
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #155724; margin: 0 0 10px 0;">🎯 Next Steps</h4>
              <ul style="color: #155724; margin: 0; padding-left: 20px;">
                <li>Mark your calendar for your appointment</li>
                <li>Prepare any questions you'd like to ask</li>
                <li>Get a good night's sleep before your session</li>
                <li>Arrive 10 minutes early on appointment day</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We're looking forward to providing you with an exceptional beauty experience!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:info@lawrei-beauty.com" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Contact Us
              </a>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Lawrei Beauty. All rights reserved.<br>
              This email was sent to ${booking.customerEmail}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@lawrei-beauty.com',
        to: booking.customerEmail,
        subject: `Payment Confirmed - ${booking.serviceName} - Lawrei Beauty`,
        html: emailContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Payment confirmation email sent to ${booking.customerEmail}:`, result.messageId);
      
      return result;
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send appointment reminder email
   */
  static async sendAppointmentReminder(bookingId: string) {
    try {
      if (!this.transporter) {
        this.initialize();
      }

      // Get booking details
      const bookingData = await db
        .select({
          id: bookings.id,
          appointmentDate: bookings.appointmentDate,
          startTime: bookings.startTime,
          customerFirstName: customers.firstName,
          customerLastName: customers.lastName,
          customerEmail: customers.email,
          serviceName: services.name,
        })
        .from(bookings)
        .leftJoin(customers, eq(bookings.customerId, customers.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (bookingData.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingData[0];
      const appointmentDate = new Date(booking.appointmentDate);
      const startTime = new Date(booking.startTime);

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Lawrei Beauty</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Appointment Reminder</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">⏰ Appointment Reminder</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dear ${booking.customerFirstName} ${booking.customerLastName},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This is a friendly reminder about your upcoming appointment at Lawrei Beauty. We're excited to see you!
            </p>
            
            <div style="background: white; border-radius: 10px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">Appointment Details</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <strong style="color: #333;">Service:</strong><br>
                  <span style="color: #666;">${booking.serviceName}</span>
                </div>
                <div>
                  <strong style="color: #333;">Date:</strong><br>
                  <span style="color: #666;">${appointmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div>
                  <strong style="color: #333;">Time:</strong><br>
                  <span style="color: #666;">${startTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}</span>
                </div>
                <div>
                  <strong style="color: #333;">Location:</strong><br>
                  <span style="color: #666;">Lawrei Beauty Studio</span>
                </div>
              </div>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">📋 Preparation Tips</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Arrive 10 minutes before your scheduled time</li>
                <li>Bring any relevant medical information</li>
                <li>Wear comfortable clothing</li>
                <li>Stay hydrated before your session</li>
                <li>Remove any makeup if applicable</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:info@lawrei-beauty.com" style="background: #ffc107; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Contact Us
              </a>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 Lawrei Beauty. All rights reserved.<br>
              This email was sent to ${booking.customerEmail}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@lawrei-beauty.com',
        to: booking.customerEmail,
        subject: `Appointment Reminder - ${booking.serviceName} - Lawrei Beauty`,
        html: emailContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Appointment reminder email sent to ${booking.customerEmail}:`, result.messageId);
      
      return result;
    } catch (error) {
      console.error('Error sending appointment reminder email:', error);
      throw error;
    }
  }
}
