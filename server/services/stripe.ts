import Stripe from 'stripe';
import { db } from '../database';
import { bookings, customers, services } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export class StripeService {
  /**
   * Create a payment intent for a booking
   */
  static async createPaymentIntent(bookingId: string) {
    try {
      // Get booking details with customer and service information
      const bookingData = await db
        .select({
          id: bookings.id,
          totalPrice: bookings.totalPrice,
          status: bookings.status,
          customerId: bookings.customerId,
          serviceId: bookings.serviceId,
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

      if (booking.status === 'paid') {
        throw new Error('Booking is already paid');
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalPrice, // Already in cents
        currency: 'usd',
        metadata: {
          bookingId: booking.id,
          customerId: booking.customerId,
          serviceId: booking.serviceId,
          serviceName: booking.serviceName,
        },
        description: `Payment for ${booking.serviceName} - ${booking.customerFirstName} ${booking.customerLastName}`,
        receipt_email: booking.customerEmail,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment and update booking status
   */
  static async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const bookingId = paymentIntent.metadata.bookingId;
        
        // Update booking status to paid
        await db
          .update(bookings)
          .set({ 
            status: 'confirmed',
            paymentStatus: 'paid',
            updatedAt: new Date()
          })
          .where(eq(bookings.id, bookingId));

        return {
          success: true,
          bookingId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        message: 'Payment not completed',
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Process Stripe webhook events
   */
  static async processWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (bookingId) {
      await db
        .update(bookings)
        .set({ 
          status: 'confirmed',
          paymentStatus: 'paid',
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      console.log(`Payment successful for booking: ${bookingId}`);
      
             // Send confirmation email
       try {
         const { EmailService } = await import('./email');
         await EmailService.sendPaymentConfirmation(bookingId);
       } catch (error) {
         console.error('Failed to send payment confirmation email:', error);
       }
    }
  }

  /**
   * Handle failed payment
   */
  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (bookingId) {
      await db
        .update(bookings)
        .set({ 
          status: 'pending',
          paymentStatus: 'failed',
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      console.log(`Payment failed for booking: ${bookingId}`);
      
      // TODO: Send payment failure notification
      // await this.sendPaymentFailureNotification(bookingId);
    }
  }

  /**
   * Handle refund
   */
  private static async handleRefund(charge: Stripe.Charge) {
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (bookingId) {
      await db
        .update(bookings)
        .set({ 
          status: 'cancelled',
          paymentStatus: 'refunded',
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      console.log(`Refund processed for booking: ${bookingId}`);
    }
  }

  /**
   * Create a refund for a booking
   */
  static async createRefund(bookingId: string, reason: string = 'customer_request') {
    try {
      // Get the payment intent for this booking
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
      });

      const paymentIntent = paymentIntents.data.find(
        pi => pi.metadata.bookingId === bookingId
      );

      if (!paymentIntent) {
        throw new Error('Payment intent not found for this booking');
      }

      // Create refund
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntent.id,
        reason: reason as Stripe.RefundCreateParams.Reason,
        metadata: {
          bookingId,
          reason,
        },
      });

      // Update booking status
      await db
        .update(bookings)
        .set({ 
          status: 'cancelled',
          paymentStatus: 'refunded',
          updatedAt: new Date()
        })
        .where(eq(bookings.id, bookingId));

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Get payment history for a customer
   */
  static async getCustomerPaymentHistory(customerId: string) {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
      });

      const customerPayments = paymentIntents.data.filter(
        pi => pi.metadata.customerId === customerId
      );

      return customerPayments.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        created: pi.created,
        metadata: pi.metadata,
      }));
    } catch (error) {
      console.error('Error getting customer payment history:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStatistics() {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const paymentIntents = await stripe.paymentIntents.list({
        limit: 1000,
        created: {
          gte: Math.floor(thirtyDaysAgo.getTime() / 1000),
        },
      });

      const successfulPayments = paymentIntents.data.filter(
        pi => pi.status === 'succeeded'
      );

      const totalRevenue = successfulPayments.reduce(
        (sum, pi) => sum + pi.amount,
        0
      );

      return {
        totalPayments: successfulPayments.length,
        totalRevenue: totalRevenue / 100, // Convert from cents to dollars
        averagePayment: successfulPayments.length > 0 
          ? (totalRevenue / successfulPayments.length) / 100 
          : 0,
        period: '30 days',
      };
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      throw error;
    }
  }
}
