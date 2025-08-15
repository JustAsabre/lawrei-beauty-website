import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

interface PaymentSectionProps {
  bookingId: string;
  amount: number;
  serviceName: string;
  customerName: string;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  serviceName: string;
  customerName: string;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

const PaymentForm = ({ 
  bookingId, 
  amount, 
  serviceName, 
  customerName, 
  onPaymentSuccess, 
  onPaymentCancel 
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [bookingId]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setPaymentIntent(data);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerName,
            },
          },
        }
      );

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Payment could not be processed.",
          variant: "destructive",
        });
      } else if (confirmedIntent.status === 'succeeded') {
        // Confirm payment with backend
        await confirmPayment(confirmedIntent.id);
        
        toast({
          title: "Payment Successful! 🎉",
          description: "Your payment has been processed successfully.",
        });
        
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium text-lg text-green-600">
                ${(amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-gray-500">
            Your payment information is secure and encrypted.
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !paymentIntent}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onPaymentCancel}
          disabled={isProcessing}
          className="px-6"
        >
          Cancel
        </Button>
      </div>

      {!paymentIntent && (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Initializing payment...</p>
        </div>
      )}
    </form>
  );
};

export default function PaymentSection(props: PaymentSectionProps) {
  const [showPayment, setShowPayment] = useState(false);

  if (!showPayment) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-xl font-semibold mb-2">Ready to Complete Your Booking</h3>
        <p className="text-gray-600 mb-6">
          Your booking has been created successfully. Complete your payment to confirm your appointment.
        </p>
        <Button
          onClick={() => setShowPayment(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Payment
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
