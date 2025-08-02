import { useState, useCallback } from 'react';

// Generic hook for API calls with loading states
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specific hook for file uploads
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data, loading, error, execute, reset } = useApi();

  const uploadFile = useCallback(async (file: File, onProgress?: (progress: number) => void) => {
    // Simulate upload progress for dummy API
    const simulateProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        onProgress?.(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    };

    // Start progress simulation
    simulateProgress();

    return execute(async () => {
      // Your actual upload logic here
      const { orderService } = await import('@/services/orderService');
      return await orderService.uploadFile(file);
    });
  }, [execute]);

  return {
    uploadFile,
    uploadProgress,
    data,
    loading,
    error,
    reset,
  };
}

// Hook for order operations
export function useOrder() {
  const api = useApi();

  const createOrder = useCallback(async (orderDetails: any) => {
    const { orderService } = await import('@/services/orderService');
    return api.execute(() => orderService.createOrder(orderDetails));
  }, [api]);

  const getOrderStatus = useCallback(async (orderId: string) => {
    const { orderService } = await import('@/services/orderService');
    return api.execute(() => orderService.getOrderStatus(orderId));
  }, [api]);

  const processPayment = useCallback(async (orderId: string, paymentMethod: 'online' | 'delivery', amount: number) => {
    const { orderService } = await import('@/services/orderService');
    return api.execute(() => orderService.processPayment(orderId, paymentMethod, amount));
  }, [api]);

  return {
    createOrder,
    getOrderStatus,
    processPayment,
    ...api,
  };
}