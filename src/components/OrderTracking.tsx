import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderDetails } from './PrintOrderForm';
import { CheckCircle, Clock, Printer, Package } from 'lucide-react';

interface OrderTrackingProps {
  orderDetails: OrderDetails;
  orderId: string;
  paymentMethod: 'online' | 'delivery';
  onStartNewOrder: () => void;
}

type OrderStatus = 'pending' | 'processing' | 'printing' | 'ready' | 'completed';

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderDetails,
  orderId,
  paymentMethod,
  onStartNewOrder
}) => {
  const [status, setStatus] = useState<OrderStatus>('pending');

  // Simulate order progress
  useEffect(() => {
    const progressSteps = ['pending', 'processing', 'printing', 'ready'] as OrderStatus[];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < progressSteps.length - 1) {
        currentStep++;
        setStatus(progressSteps[currentStep]);
      } else {
        clearInterval(interval);
      }
    }, 3000); // Change status every 3 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'pending':
        return { 
          label: 'Order Received', 
          color: 'bg-progress', 
          icon: Clock,
          description: 'Your order has been received and is being reviewed.'
        };
      case 'processing':
        return { 
          label: 'Processing', 
          color: 'bg-progress', 
          icon: Package,
          description: 'Your files are being prepared for printing.'
        };
      case 'printing':
        return { 
          label: 'Printing', 
          color: 'bg-progress', 
          icon: Printer,
          description: 'Your order is currently being printed.'
        };
      case 'ready':
        return { 
          label: 'Ready for Pickup', 
          color: 'bg-success', 
          icon: CheckCircle,
          description: 'Your order is ready! Please visit the shop to collect.'
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'bg-success', 
          icon: CheckCircle,
          description: 'Order completed successfully. Thank you!'
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'bg-muted', 
          icon: Clock,
          description: 'Status unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 animate-scale-in">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">Your order has been confirmed</p>
          </div>
        </div>

        {/* Order Info */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Order #{orderId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <StatusIcon className="w-6 h-6 text-foreground" />
                <Badge 
                  className={`${statusInfo.color} text-white px-3 py-1`}
                >
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {statusInfo.description}
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{orderDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Copies:</span>
                <span className="font-medium">{orderDetails.copies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paper:</span>
                <span className="font-medium">{orderDetails.paperSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment:</span>
                <span className="font-medium capitalize">
                  {paymentMethod === 'online' ? 'Paid Online' : 'Pay on Delivery'}
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium text-primary">
                ⚠️ Important: Keep this screen open to track your order status in real-time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Timeline */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(['pending', 'processing', 'printing', 'ready'] as OrderStatus[]).map((step, index) => {
                const stepInfo = getStatusInfo(step);
                const StepIcon = stepInfo.icon;
                const isCompleted = ['pending', 'processing', 'printing', 'ready'].indexOf(status) >= index;
                const isCurrent = status === step;

                return (
                  <div key={step} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`}>
                      <StepIcon className={`w-4 h-4 ${
                        isCompleted ? 'text-success-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {stepInfo.label}
                      </p>
                    </div>
                    {isCurrent && (
                      <Badge variant="outline" className="border-primary text-primary">
                        Current
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* New Order Button */}
        {status === 'ready' && (
          <Button onClick={onStartNewOrder} className="w-full" size="lg">
            Place New Order
          </Button>
        )}
      </div>
    </div>
  );
};