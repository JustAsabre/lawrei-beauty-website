import { db } from '../database';
import { bookings, customers, services, payments } from '../../shared/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface CustomerPortalData {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
  };
  bookings: {
    id: string;
    serviceName: string;
    appointmentDate: Date;
    status: string;
    totalPrice: number;
    notes?: string;
    createdAt: Date;
  }[];
  paymentHistory: {
    id: string;
    amount: number;
    status: string;
    date: Date;
    description: string;
  }[];
  upcomingAppointments: {
    id: string;
    serviceName: string;
    appointmentDate: Date;
    status: string;
  }[];
  statistics: {
    totalBookings: number;
    totalSpent: number;
    upcomingAppointments: number;
    completedServices: number;
  };
}

export interface CustomerPortalResponse {
  success: boolean;
  data?: CustomerPortalData;
  error?: string;
}

export class CustomerPortalService {
  private static instance: CustomerPortalService;

  private constructor() {}

  public static getInstance(): CustomerPortalService {
    if (!CustomerPortalService.instance) {
      CustomerPortalService.instance = new CustomerPortalService();
    }
    return CustomerPortalService.instance;
  }

  /**
   * Get customer portal data by email
   */
  public async getCustomerPortalData(email: string): Promise<CustomerPortalResponse> {
    try {
      // Find customer by email
      const customer = await db.query.customers.findFirst({
        where: eq(customers.email, email)
      });

      if (!customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      // Get all bookings for the customer
      const customerBookings = await db.query.bookings.findMany({
        where: eq(bookings.customerId, customer.id),
        with: {
          service: true
        },
        orderBy: [desc(bookings.createdAt)]
      });

      // Get payment history
      const paymentHistory = await db.query.payments.findMany({
        where: eq(payments.customerId, customer.id),
        orderBy: [desc(payments.createdAt)]
      });

      // Calculate statistics
      const totalBookings = customerBookings.length;
      const totalSpent = customerBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const upcomingAppointments = customerBookings.filter(booking => 
        new Date(booking.appointmentDate) > new Date() && 
        ['confirmed', 'pending'].includes(booking.status)
      ).length;
      const completedServices = customerBookings.filter(booking => 
        booking.status === 'completed'
      ).length;

      // Format data for frontend
      const portalData: CustomerPortalData = {
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt
        },
        bookings: customerBookings.map(booking => ({
          id: booking.id,
          serviceName: booking.service.name,
          appointmentDate: booking.appointmentDate,
          status: booking.status,
          totalPrice: booking.totalPrice,
          notes: booking.notes || undefined,
          createdAt: booking.createdAt
        })),
        paymentHistory: paymentHistory.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          date: payment.createdAt,
          description: `Payment for ${payment.description || 'appointment'}`
        })),
        upcomingAppointments: customerBookings
          .filter(booking => 
            new Date(booking.appointmentDate) > new Date() && 
            ['confirmed', 'pending'].includes(booking.status)
          )
          .map(booking => ({
            id: booking.id,
            serviceName: booking.service.name,
            appointmentDate: booking.appointmentDate,
            status: booking.status
          })),
        statistics: {
          totalBookings,
          totalSpent,
          upcomingAppointments,
          completedServices
        }
      };

      return {
        success: true,
        data: portalData
      };
    } catch (error) {
      console.error('Failed to get customer portal data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get customer portal data by customer ID
   */
  public async getCustomerPortalDataById(customerId: string): Promise<CustomerPortalResponse> {
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

      return await this.getCustomerPortalData(customer.email);
    } catch (error) {
      console.error('Failed to get customer portal data by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get customer's upcoming appointments
   */
  public async getUpcomingAppointments(customerId: string): Promise<CustomerPortalResponse> {
    try {
      const upcomingBookings = await db.query.bookings.findMany({
        where: and(
          eq(bookings.customerId, customerId),
          gte(bookings.appointmentDate, new Date()),
          eq(bookings.status, 'confirmed')
        ),
        with: {
          service: true
        },
        orderBy: [bookings.appointmentDate]
      });

      const upcomingAppointments = upcomingBookings.map(booking => ({
        id: booking.id,
        serviceName: booking.service.name,
        appointmentDate: booking.appointmentDate,
        status: booking.status
      }));

      return {
        success: true,
        data: {
          customer: {} as any,
          bookings: [],
          paymentHistory: [],
          upcomingAppointments,
          statistics: {} as any
        }
      };
    } catch (error) {
      console.error('Failed to get upcoming appointments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get customer's booking history
   */
  public async getBookingHistory(customerId: string, limit: number = 10): Promise<CustomerPortalResponse> {
    try {
      const customerBookings = await db.query.bookings.findMany({
        where: eq(bookings.customerId, customerId),
        with: {
          service: true
        },
        orderBy: [desc(bookings.createdAt)],
        limit
      });

      const bookings = customerBookings.map(booking => ({
        id: booking.id,
        serviceName: booking.service.name,
        appointmentDate: booking.appointmentDate,
        status: booking.status,
        totalPrice: booking.totalPrice,
        notes: booking.notes || undefined,
        createdAt: booking.createdAt
      }));

      return {
        success: true,
        data: {
          customer: {} as any,
          bookings,
          paymentHistory: [],
          upcomingAppointments: [],
          statistics: {} as any
        }
      };
    } catch (error) {
      console.error('Failed to get booking history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get customer's payment history
   */
  public async getPaymentHistory(customerId: string, limit: number = 10): Promise<CustomerPortalResponse> {
    try {
      const customerPayments = await db.query.payments.findMany({
        where: eq(payments.customerId, customerId),
        orderBy: [desc(payments.createdAt)],
        limit
      });

      const paymentHistory = customerPayments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        date: payment.createdAt,
        description: `Payment for ${payment.description || 'appointment'}`
      }));

      return {
        success: true,
        data: {
          customer: {} as any,
          bookings: [],
          paymentHistory,
          upcomingAppointments: [],
          statistics: {} as any
        }
      };
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Cancel an upcoming appointment
   */
  public async cancelAppointment(customerId: string, bookingId: string): Promise<CustomerPortalResponse> {
    try {
      // Verify the booking belongs to the customer
      const booking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.id, bookingId),
          eq(bookings.customerId, customerId)
        )
      });

      if (!booking) {
        return {
          success: false,
          error: 'Booking not found or access denied'
        };
      }

      // Check if appointment is in the future
      if (new Date(booking.appointmentDate) <= new Date()) {
        return {
          success: false,
          error: 'Cannot cancel past or current appointments'
        };
      }

      // Check if appointment can be cancelled (not already cancelled)
      if (booking.status === 'cancelled') {
        return {
          success: false,
          error: 'Appointment is already cancelled'
        };
      }

      // Update booking status
      await db.update(bookings)
        .set({ 
          status: 'cancelled',
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Reschedule an appointment
   */
  public async rescheduleAppointment(
    customerId: string, 
    bookingId: string, 
    newDate: Date
  ): Promise<CustomerPortalResponse> {
    try {
      // Verify the booking belongs to the customer
      const booking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.id, bookingId),
          eq(bookings.customerId, customerId)
        )
      });

      if (!booking) {
        return {
          success: false,
          error: 'Booking not found or access denied'
        };
      }

      // Check if appointment is in the future
      if (new Date(booking.appointmentDate) <= new Date()) {
        return {
          success: false,
          error: 'Cannot reschedule past or current appointments'
        };
      }

      // Check if appointment can be rescheduled
      if (['cancelled', 'completed'].includes(booking.status)) {
        return {
          success: false,
          error: 'Cannot reschedule cancelled or completed appointments'
        };
      }

      // Check if new date is in the future
      if (newDate <= new Date()) {
        return {
          success: false,
          error: 'New appointment date must be in the future'
        };
      }

      // Update booking date
      await db.update(bookings)
        .set({ 
          appointmentDate: newDate,
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get customer preferences and settings
   */
  public async getCustomerPreferences(customerId: string): Promise<CustomerPortalResponse> {
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

      // For now, return basic customer info
      // You can extend this to include preferences, notification settings, etc.
      return {
        success: true,
        data: {
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            createdAt: customer.createdAt
          },
          bookings: [],
          paymentHistory: [],
          upcomingAppointments: [],
          statistics: {} as any
        }
      };
    } catch (error) {
      console.error('Failed to get customer preferences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export default CustomerPortalService;
