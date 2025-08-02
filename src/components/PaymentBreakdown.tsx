import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderDetails } from './PrintOrderForm';
import { CreditCard, Truck } from 'lucide-react';

interface PaymentBreakdownProps {
  orderDetails: OrderDetails;
  onPayOnline: () => void;
  onPayOnDelivery: () => void;
}

export const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({
  orderDetails,
  onPayOnline,
  onPayOnDelivery
}) => {
  // Calculate pricing (simplified logic)
  const basePricePerPage = orderDetails.color === 'color' ? 2 : 1;
  const sizeMultiplier = orderDetails.paperSize === 'A3' ? 1.5 : 1;
  const sideMultiplier = orderDetails.printSide === 'double-sided' ? 1.8 : 1;
  
  const subtotal = Math.round(basePricePerPage * sizeMultiplier * sideMultiplier * orderDetails.copies);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;

  const formatDisplayValue = (value: string) => {
    switch (value) {
      case 'one-sided': return 'One Sided';
      case 'double-sided': return 'Double Sided';
      case 'color': return 'Color';
      case 'bw': return 'Black & White';
      default: return value.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 animate-scale-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Payment Breakdown</h1>
          <p className="text-muted-foreground">Review your order details</p>
        </div>

        {/* Order Summary */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{orderDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">File:</span>
                <span className="font-medium text-right max-w-40 truncate">
                  {orderDetails.file?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Copies:</span>
                <span className="font-medium">{orderDetails.copies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paper Size:</span>
                <span className="font-medium">{orderDetails.paperSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Print Side:</span>
                <span className="font-medium">{formatDisplayValue(orderDetails.printSide)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color:</span>
                <span className="font-medium">{formatDisplayValue(orderDetails.color)}</span>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <div className="space-y-3">
          <Button 
            onClick={onPayOnline}
            className="w-full"
            size="lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay Online
          </Button>
          
          <Button 
            onClick={onPayOnDelivery}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Truck className="w-5 h-5 mr-2" />
            Pay on Delivery
          </Button>
        </div>
      </div>
    </div>
  );
};