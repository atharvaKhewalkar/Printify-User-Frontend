import { apiClient, API_ENDPOINTS } from './api';
import { OrderDetails } from '@/components/PrintOrderForm';

// API Response Types
export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  message: string;
}

export interface OrderStatusResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'printing' | 'ready' | 'completed';
  estimatedCompletion?: string;
  message?: string;
}

export interface UploadFileResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  fileUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
}

// Order Service Class
class OrderService {
  // Upload file to backend
  async uploadFile(file: File): Promise<UploadFileResponse> {
    try {
      // This now makes a real API call to your backend
      return await apiClient.uploadFile<UploadFileResponse>(API_ENDPOINTS.UPLOAD, file);
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Create new order
  async createOrder(orderDetails: OrderDetails & { fileId?: string }): Promise<CreateOrderResponse> {
    try {
      // This now makes a real API call to your backend
      return await apiClient.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS, orderDetails);
    } catch (error) {
      console.error('Order creation failed:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    try {
      // This now makes a real API call to your backend
      return await apiClient.get<OrderStatusResponse>(`${API_ENDPOINTS.STATUS}/${orderId}`);
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  // Process payment
  async processPayment(orderId: string, paymentMethod: 'online' | 'delivery', amount: number): Promise<PaymentResponse> {
    try {
        // This now makes a real API call to your backend
        return await apiClient.post<PaymentResponse>(API_ENDPOINTS.PAYMENT, {
          orderId,
          paymentMethod,
          amount,
        });
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('Failed to process payment');
    }
  }
}

export const orderService = new OrderService();
