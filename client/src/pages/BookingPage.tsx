import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, CreditCard, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { customPlans as fallbackCustomPlans, standardPlans as fallbackStandardPlans } from '@/content/siteContent';
import { openMailDraft, postWorkerJson, saveLeadToCloudflareBackground } from '@/lib/formSubmit';
import { getCustomPlans, getStandardPlans } from '@/lib/sanity';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

type CouponPreviewResponse = {
  valid: boolean;
  code?: string;
  discountAmount?: number;
  finalAmount?: number;
  reason?: string;
};

type CreateOrderResponse = {
  keyId: string;
  orderId: string;
  currency: string;
  amount: number;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
};

type VerifyPaymentResponse = {
  success: boolean;
};

type CheckoutPlan = {
  id: string;
  label: string;
  subgroup: string;
  amountLabel: string;
  planType: 'standard' | 'custom';
};

function parseRupees(amountLabel: string): number {
  const clean = amountLabel.replace(/[^0-9]/g, '');
  return Number.parseInt(clean || '0', 10);
}

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: standardFromCms } = useQuery({
    queryKey: ['sanity', 'standardPlans'],
    queryFn: getStandardPlans,
  });
  const { data: customFromCms } = useQuery({
    queryKey: ['sanity', 'customPlans'],
    queryFn: getCustomPlans,
  });

  const standardPlans = standardFromCms && standardFromCms.length > 0 ? standardFromCms : fallbackStandardPlans;
  const customPlans = customFromCms && customFromCms.length > 0 ? customFromCms : fallbackCustomPlans;

  const groupedPlans = useMemo(() => {
    return standardPlans.reduce<Record<string, Array<(typeof standardPlans)[number]>>>((acc, plan) => {
      if (!acc[plan.subgroup]) {
        acc[plan.subgroup] = [];
      }
      acc[plan.subgroup].push(plan);
      return acc;
    }, {});
  }, [standardPlans]);

  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    couponCode: '',
  });
  const [couponPreview, setCouponPreview] = useState<CouponPreviewResponse | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCheckout = (plan: CheckoutPlan) => {
    setSelectedPlan(plan);
    setCouponPreview(null);
    setCheckoutForm({ name: '', email: '', phone: '', couponCode: '' });
  };

  const applyCoupon = async () => {
    if (!selectedPlan) return;

    const code = checkoutForm.couponCode.trim();
    if (!code) {
      setCouponPreview(null);
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const preview = await postWorkerJson<CouponPreviewResponse>('/api/coupons/preview', {
        planId: selectedPlan.id,
        couponCode: code,
      });
      setCouponPreview(preview);
      toast({
        title: preview.valid ? 'Coupon applied' : 'Coupon invalid',
        description: preview.valid
          ? `You save INR ${(preview.discountAmount || 0).toLocaleString()}.`
          : preview.reason || 'Please check the coupon code and try again.',
        variant: preview.valid ? 'default' : 'destructive',
      });
    } catch (error) {
      setCouponPreview({ valid: false, reason: 'Could not validate coupon right now.' });
      toast({
        title: 'Coupon check failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const startCheckout = async () => {
    if (!selectedPlan) return;

    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone) {
      toast({
        title: 'Missing details',
        description: 'Name, email, and phone are required before checkout.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingOrder(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Unable to load Razorpay checkout script.');

      const order = await postWorkerJson<CreateOrderResponse>('/api/payments/create-order', {
        planId: selectedPlan.id,
        couponCode: checkoutForm.couponCode.trim() || undefined,
        customerName: checkoutForm.name,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
      });

      const options: Record<string, unknown> = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Mentoria',
        description: `${selectedPlan.label} (${selectedPlan.subgroup})`,
        order_id: order.orderId,
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone,
        },
        theme: { color: '#4f46e5' },
        handler: async (response: any) => {
          try {
            await postWorkerJson<VerifyPaymentResponse>('/api/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            saveLeadToCloudflareBackground({
              formType: `${selectedPlan.planType}-payment-checkout`,
              name: checkoutForm.name,
              email: checkoutForm.email,
              phone: checkoutForm.phone,
              message: `Plan: ${selectedPlan.label} | Coupon: ${checkoutForm.couponCode || 'none'} | Final amount: INR ${order.finalAmount.toLocaleString()}`,
              metadata: {
                planId: selectedPlan.id,
                orderId: order.orderId,
                discountAmount: order.discountAmount,
                finalAmount: order.finalAmount,
              },
            });

            openMailDraft(
              `Payment confirmation - ${selectedPlan.label}`,
              [
                `Name: ${checkoutForm.name}`,
                `Email: ${checkoutForm.email}`,
                `Phone: ${checkoutForm.phone}`,
                `Plan: ${selectedPlan.label} (${selectedPlan.subgroup})`,
                `Order ID: ${order.orderId}`,
                `Amount Paid: INR ${order.finalAmount.toLocaleString()}`,
                `Coupon: ${checkoutForm.couponCode || 'Not used'}`,
                '',
                'Please share next steps for mentorship onboarding.',
              ].join('\n'),
            );

            toast({
              title: 'Payment successful',
              description: 'Verification completed and email draft opened for confirmation.',
            });

            setSelectedPlan(null);
          } catch (verifyError) {
            toast({
              title: 'Verification failed',
              description: verifyError instanceof Error ? verifyError.message : 'Please contact support with your order details.',
              variant: 'destructive',
            });
          }
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on('payment.failed', (response: any) => {
        toast({
          title: 'Payment failed',
          description: response?.error?.description || 'Please try again.',
          variant: 'destructive',
        });
      });

      checkout.open();
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const selectedPrice = selectedPlan ? parseRupees(selectedPlan.amountLabel) : 0;
  const previewFinal = couponPreview?.valid && couponPreview.finalAmount ? couponPreview.finalAmount : selectedPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => setLocation('/')} className="mb-2" data-testid="button-back-home">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8 md:p-10">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">Invest in Your Future</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose a Mentorship Path That Fits Your Goals</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Pricing, features, blogs, and testimonials are fetched from Sanity. Checkout is powered by Razorpay through Cloudflare Worker APIs.
            </p>
          </div>
        </Card>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Standard Mentoria Packages</h2>
            <p className="text-muted-foreground mt-2">Comprehensive packages grouped by learner stage.</p>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedPlans).map(([subgroup, plans]) => (
              <div key={subgroup} className="space-y-4">
                <h3 className="text-xl font-semibold">{subgroup}</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="p-6 flex flex-col gap-5 border-primary/10 shadow-sm">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-2">{plan.id}</p>
                        <h4 className="text-2xl font-bold">{plan.label}</h4>
                        <p className="text-muted-foreground mt-2">{plan.amountLabel}</p>
                      </div>

                      <ul className="space-y-2 text-sm text-foreground/90">
                        {(plan.features || []).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-0.5 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="mt-auto"
                        onClick={() =>
                          openCheckout({
                            id: plan.id,
                            label: plan.label,
                            subgroup: plan.subgroup,
                            amountLabel: plan.amountLabel,
                            planType: 'standard',
                          })
                        }
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Want To Customise Your Mentorship Plan?</h2>
            <p className="text-muted-foreground mt-2">
              If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more of the following.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {customPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden border-primary/10 shadow-sm">
                {plan.image ? (
                  <img src={plan.image} alt={plan.label} className="w-full h-44 object-cover" loading="lazy" />
                ) : null}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">{plan.id}</p>
                    <h4 className="text-xl font-semibold">{plan.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{plan.amountLabel}</p>
                  </div>
                  <p className="text-sm text-foreground/85">{plan.description}</p>

                  <Button
                    className="w-full"
                    onClick={() =>
                      openCheckout({
                        id: plan.id,
                        label: plan.label,
                        subgroup: 'Custom Package',
                        amountLabel: plan.amountLabel,
                        planType: 'custom',
                      })
                    }
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2 font-semibold mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            After payment
          </div>
          <p className="text-muted-foreground mb-6">
            Send your payment confirmation or preferred session details directly, and the MindElevate team can coordinate the next steps with you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="mailto:gladis69diana@gmail.com?subject=MindElevate%20payment%20confirmation">
                <Mail className="h-4 w-4 mr-2" />
                Email Confirmation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+919791237169">
                <Phone className="h-4 w-4 mr-2" />
                Call MindElevate
              </a>
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Checkout - {selectedPlan?.label}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{selectedPlan?.label}</p>
              <p className="text-muted-foreground">{selectedPlan?.subgroup}</p>
              <p className="mt-1">Base Price: <span className="font-semibold">{selectedPlan?.amountLabel}</span></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="checkout-name">Name</Label>
                <Input id="checkout-name" value={checkoutForm.name} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="checkout-email">Email</Label>
                <Input id="checkout-email" type="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="checkout-phone">Phone</Label>
              <Input id="checkout-phone" type="tel" value={checkoutForm.phone} onChange={(e) => setCheckoutForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                placeholder="Coupon code"
                value={checkoutForm.couponCode}
                onChange={(e) => setCheckoutForm((prev) => ({ ...prev, couponCode: e.target.value }))}
              />
              <Button variant="outline" onClick={applyCoupon} disabled={isApplyingCoupon}>
                {isApplyingCoupon ? 'Checking...' : 'Apply Coupon'}
              </Button>
            </div>

            <div className="rounded-md border p-3 text-sm">
              <p>Payable Amount: <span className="font-semibold">INR {previewFinal.toLocaleString()}</span></p>
              {couponPreview?.valid ? (
                <p className="text-green-700">Coupon applied. You save INR {(couponPreview.discountAmount || 0).toLocaleString()}.</p>
              ) : null}
              {couponPreview && !couponPreview.valid ? (
                <p className="text-red-700">{couponPreview.reason || 'Coupon is invalid.'}</p>
              ) : null}
            </div>

            <Button className="w-full" onClick={startCheckout} disabled={isCreatingOrder}>
              {isCreatingOrder ? 'Opening checkout...' : 'Proceed to Razorpay'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
