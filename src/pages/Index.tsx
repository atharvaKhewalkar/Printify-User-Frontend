import React, { useState } from 'react';
import { PrintOrderForm, OrderDetails } from '@/components/PrintOrderForm';
import { PaymentBreakdown } from '@/components/PaymentBreakdown';
import { OrderTracking } from '@/components/OrderTracking';

type AppState = 'order-form' | 'payment' | 'tracking';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('order-form');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'delivery'>('online');

  const handleOrderSubmit = (order: OrderDetails) => {
    setOrderDetails(order);
    setCurrentState('payment');
  };

  const handlePayOnline = () => {
    // Generate order ID
    const id = Math.random().toString(36).substr(2, 8).toUpperCase();
    setOrderId(id);
    setPaymentMethod('online');
    setCurrentState('tracking');
  };

  const handlePayOnDelivery = () => {
    // Generate order ID
    const id = Math.random().toString(36).substr(2, 8).toUpperCase();
    setOrderId(id);
    setPaymentMethod('delivery');
    setCurrentState('tracking');
  };

  const handleStartNewOrder = () => {
    setCurrentState('order-form');
    setOrderDetails(null);
    setOrderId('');
  };

  if (currentState === 'order-form') {
    return <PrintOrderForm onSubmit={handleOrderSubmit} />;
  }

  if (currentState === 'payment' && orderDetails) {
    return (
      <PaymentBreakdown
        orderDetails={orderDetails}
        onPayOnline={handlePayOnline}
        onPayOnDelivery={handlePayOnDelivery}
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

  return null;
};

export default Index;
