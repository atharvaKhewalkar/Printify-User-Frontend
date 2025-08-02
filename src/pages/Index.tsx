import React, { useState } from 'react';
import { PrintOrderForm, OrderDetails } from '@/components/PrintOrderForm';
import { PaymentBreakdown } from '@/components/PaymentBreakdown';
import { OrderTracking } from '@/components/OrderTracking';
import { useOrder } from '@/hooks/useApi';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { LoadingScreen } from '@/components/LoadingScreen';

type AppState = 'order-form' | 'payment' | 'tracking';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('order-form');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'delivery'>('online');
  const [totalCost, setTotalCost] = useState(0);

  const { toast } = useToast();
  const { loading, error, execute: executeOrderAction } = useOrder();

  // Step 1: Handle the initial order submission from the form
  const handleOrderSubmit = async (order: OrderDetails) => {
    if (!order.file) {
      toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }

    try {
      // First, upload the file
      const uploadResponse = await executeOrderAction(() => orderService.uploadFile(order.file!));
      if (!uploadResponse?.success) {
        throw new Error("File upload failed.");
      }
      
      toast({ title: "Success", description: "File uploaded successfully!" });

      // Then, create the order with the uploaded file info
      const orderPayload = { ...order, file: uploadResponse };
      const createOrderResponse = await executeOrderAction(() => orderService.createOrder(orderPayload as any));
      
      if (createOrderResponse?.success && createOrderResponse.orderDetails) {
        setOrderDetails(order);
        setOrderId(createOrderResponse.orderId);
        // Calculate total cost for payment screen
        const basePricePerPage = order.color === 'color' ? 2 : 1;
        const sizeMultiplier = order.paperSize === 'A3' ? 1.5 : 1;
        const sideMultiplier = order.printSide === 'double-sided' ? 1.8 : 1;
        const subtotal = Math.round(basePricePerPage * sizeMultiplier * sideMultiplier * order.copies);
        const tax = Math.round(subtotal * 0.1);
        setTotalCost(subtotal + tax);
        
        setCurrentState('payment');
        toast({ title: "Order Created!", description: `Your order ID is ${createOrderResponse.orderId}` });
      } else {
        throw new Error(createOrderResponse?.message || "Order creation failed.");
      }
    } catch (err: any) {
      toast({ title: "An Error Occurred", description: err.message || "Could not process order.", variant: "destructive" });
    }
  };

  // Step 2: Handle the payment choice
  const handlePayment = async (method: 'online' | 'delivery') => {
    if (!orderId || !totalCost) {
      toast({ title: "Error", description: "Missing order information.", variant: "destructive" });
      return;
    }

    try {
      const paymentResponse = await executeOrderAction(() => orderService.processPayment(orderId, method, totalCost));
      
      if (paymentResponse?.success) {
        setPaymentMethod(method);
        setCurrentState('tracking');
        toast({ title: "Payment Processed", description: "You can now track your order." });
      } else {
        throw new Error(paymentResponse?.message || "Payment failed.");
      }
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.message || "Could not process payment.", variant: "destructive" });
    }
  };

  const handleStartNewOrder = () => {
    setCurrentState('order-form');
    setOrderDetails(null);
    setOrderId('');
    setTotalCost(0);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentState === 'order-form') {
    return <PrintOrderForm onSubmit={handleOrderSubmit} />;
  }

  if (currentState === 'payment' && orderDetails) {
    return (
      <PaymentBreakdown
        orderDetails={orderDetails}
        onPayOnline={() => handlePayment('online')}
        onPayOnDelivery={() => handlePayment('delivery')}
      />
    );
  }

  if (currentState === 'tracking' && orderDetails && orderId) {
    return (
      <OrderTracking
        orderDetails={orderDetails}
        orderId={orderId}
        paymentMethod={paymentMethod}
        onStartNewOrder={handleStartNewOrder}
      />
    );
  }

  return <LoadingScreen />; // Fallback
};

export default Index;
