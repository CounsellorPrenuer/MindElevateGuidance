import { useQuery } from '@tanstack/react-query';
import { CreditCard, User, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Payment } from '@shared/schema';

export default function PaymentsManagement() {
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['/api/admin/payments'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-600';
      case 'created':
        return 'bg-blue-500/10 text-blue-600';
      case 'failed':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Total: {payments.length}</p>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="p-6" data-testid={`payment-card-${payment.id}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    ₹{payment.amount.toLocaleString()}
                  </h3>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Order ID: {payment.razorpayOrderId}
                </p>
                {payment.razorpayPaymentId && (
                  <p className="text-sm text-muted-foreground">
                    Payment ID: {payment.razorpayPaymentId}
                  </p>
                )}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {new Date(payment.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{payment.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{payment.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{payment.customerPhone}</span>
              </div>
            </div>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No payments yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
