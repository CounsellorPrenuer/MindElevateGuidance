import { useEffect, useRef } from 'react';

type PaymentButtonProps = {
  paymentButtonId: string;
};

export default function RazorpayPaymentButton({ paymentButtonId }: PaymentButtonProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    form.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.async = true;
    script.setAttribute('data-payment_button_id', paymentButtonId);
    form.appendChild(script);
  }, [paymentButtonId]);

  return <form ref={formRef} className="min-h-12" />;
}
