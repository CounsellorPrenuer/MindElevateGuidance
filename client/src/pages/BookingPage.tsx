import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Calendar, User } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    sessionType: '',
    preferredDate: '',
    message: '',
  });

  const serviceOptions = [
    { value: 'career-guidance', label: 'Career Guidance - ₹2,500', price: 2500 },
    { value: 'workshop', label: 'Workshop Session - ₹5,000', price: 5000 },
    { value: 'admission-guidance', label: 'Admission Guidance - ₹3,500', price: 3500 },
    { value: 'corporate-training', label: 'Corporate Training - ₹10,000', price: 10000 },
  ];

  const sessionTypes = [
    { value: 'online', label: 'Online Session' },
    { value: 'in-person', label: 'In-Person Session' },
  ];

  const selectedService = serviceOptions.find(s => s.value === formData.service);
  const amount = selectedService?.price || 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.sessionType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          service: formData.service,
          sessionType: formData.sessionType,
          preferredDate: formData.preferredDate,
          message: formData.message,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MindElevate',
        description: selectedService?.label || 'Counseling Session',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast({
                title: 'Payment Successful!',
                description: 'Your booking has been confirmed. We will contact you soon.',
              });
              setLocation('/');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast({
              title: 'Verification Failed',
              description: 'Payment verification failed. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        });
      });
      razorpay.open();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Your Session</h1>
            <p className="text-muted-foreground">
              Fill in your details and proceed to payment to confirm your booking
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-booking-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-booking-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                data-testid="input-booking-phone"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="service">Select Service *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger data-testid="select-booking-service">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sessionType">Session Type *</Label>
                <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value })}>
                  <SelectTrigger data-testid="select-booking-session-type">
                    <SelectValue placeholder="Choose session type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="preferredDate"
                  type="date"
                  className="pl-10"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  data-testid="input-booking-date"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Any specific requirements or questions?"
                data-testid="input-booking-message"
              />
            </div>

            {amount > 0 && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{amount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Payment is securely processed through Razorpay
                </p>
              </Card>
            )}

            <Button
              onClick={handlePayment}
              disabled={isProcessing || !amount}
              className="w-full"
              size="lg"
              data-testid="button-proceed-payment"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {isProcessing ? 'Processing...' : `Proceed to Payment (₹${amount.toLocaleString()})`}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
