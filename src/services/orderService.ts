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
      // DUMMY RESPONSE - Replace with real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            fileId: `file_${Date.now()}`,
            fileName: file.name,
            fileUrl: `https://dummy-storage.com/${file.name}`,
          });
        }, 1000);
      });

      // Real API call (uncomment when backend is ready):
      // return await apiClient.uploadFile<UploadFileResponse>(API_ENDPOINTS.UPLOAD, file);
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Create new order
  async createOrder(orderDetails: OrderDetails & { fileId?: string }): Promise<CreateOrderResponse> {
    try {
      // DUMMY RESPONSE - Replace with real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            orderId: `ORDER_${Date.now().toString(36).toUpperCase()}`,
            message: 'Order created successfully',
          });
        }, 800);
      });

      // Real API call (uncomment when backend is ready):
      // return await apiClient.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS, orderDetails);
    } catch (error) {
      console.error('Order creation failed:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    try {
      // DUMMY RESPONSE - Replace with real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const statuses = ['pending', 'processing', 'printing', 'ready', 'completed'] as const;
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          resolve({
            orderId,
            status: randomStatus,
            estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            message: `Order is currently ${randomStatus}`,
          });
        }, 500);
      });

      // Real API call (uncomment when backend is ready):
      // return await apiClient.get<OrderStatusResponse>(`${API_ENDPOINTS.STATUS}/${orderId}`);
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  // Process payment
  async processPayment(orderId: string, paymentMethod: 'online' | 'delivery', amount: number): Promise<PaymentResponse> {
    try {
      // DUMMY RESPONSE - Replace with real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            paymentId: `PAY_${Date.now().toString(36).toUpperCase()}`,
            status: paymentMethod === 'online' ? 'success' : 'pending',
            transactionId: paymentMethod === 'online' ? `TXN_${Date.now()}` : undefined,
          });
        }, 1500);
      });

      // Real API call (uncomment when backend is ready):
      // return await apiClient.post<PaymentResponse>(API_ENDPOINTS.PAYMENT, {
      //   orderId,
      //   paymentMethod,
      //   amount,
      // });
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('Failed to process payment');
    }
  }

  // Update order status (for admin/shopkeeper)
  async updateOrderStatus(orderId: string, status: OrderStatusResponse['status']): Promise<{ success: boolean }> {
    try {
      // DUMMY RESPONSE - Replace with real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      });

      // Real API call (uncomment when backend is ready):
      // return await apiClient.put<{ success: boolean }>(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, { status });
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new Error('Failed to update order status');
    }
  }
}

export const orderService = new OrderService();
