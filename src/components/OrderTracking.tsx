import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderDetails } from './PrintOrderForm';
import { CheckCircle, Clock, Printer, Package, AlertCircle } from 'lucide-react';
import { orderService, OrderStatusResponse } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Poll the backend for real order status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await orderService.getOrderStatus(orderId);
        if (response.status !== status) {
            toast({ title: "Order Status Updated!", description: `Your order is now: ${response.status}` });
        }
        setStatus(response.status);
        setError(null);
      } catch (err) {
        setError('Could not fetch order status.');
        console.error(err);
      }
    };

    fetchStatus(); // Fetch immediately on load
    const interval = setInterval(fetchStatus, 5000); // Then poll every 5 seconds

    // Stop polling if order is complete or component unmounts
    if (status === 'completed' || status === 'ready') {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [orderId, status, toast]);

  const getStatusInfo = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'pending':
        return { 
          label: 'Order Received', 
          color: 'bg-gray-500', 
          icon: Clock,
          description: 'Your order has been received and is being reviewed.'
        };
      case 'processing':
        return { 
          label: 'Processing', 
          color: 'bg-blue-500', 
          icon: Package,
          description: 'Your files are being prepared for printing.'
        };
      case 'printing':
        return { 
          label: 'Printing', 
          color: 'bg-orange-500', 
          icon: Printer,
          description: 'Your order is currently being printed.'
        };
      case 'ready':
        return { 
          label: 'Ready for Pickup', 
          color: 'bg-green-500', 
          icon: CheckCircle,
          description: 'Your order is ready! Please visit the shop to collect.'
        };
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'bg-green-600', 
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
            <h1 className="text-2xl font-bold text-foreground">Payment Processed!</h1>
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
              {error && (
                <div className="flex items-center justify-center text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
              )}
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
          </CardContent>
        </Card>

        {/* New Order Button */}
        {(status === 'ready' || status === 'completed') && (
          <Button onClick={onStartNewOrder} className="w-full" size="lg">
            Place New Order
          </Button>
        )}
      </div>
    </div>
  );
};
