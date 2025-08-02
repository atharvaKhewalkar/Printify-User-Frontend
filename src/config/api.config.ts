// API Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: {
    development: 'http://localhost:3001/api',
    production: 'https://your-backend-domain.com/api', // Replace with your production URL
    staging: 'https://staging-your-backend.com/api', // Replace with your staging URL
  },
  
  // Request timeouts
  TIMEOUT: {
    default: 10000, // 10 seconds
    upload: 60000,  // 60 seconds for file uploads
    payment: 30000, // 30 seconds for payments
  },
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000, // 1 second
  },
  
  // File upload limits
  UPLOAD: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ],
  },
} as const;

// Get current API base URL based on environment
export const getCurrentApiUrl = (): string => {
  const env = process.env.NODE_ENV as keyof typeof API_CONFIG.BASE_URL;
  return API_CONFIG.BASE_URL[env] || API_CONFIG.BASE_URL.development;
};

// API endpoints structure for your Node.js backend
export const BACKEND_ROUTES = {
  // Order management
  orders: {
    create: 'POST /orders',
    getById: 'GET /orders/:id',
    updateStatus: 'PUT /orders/:id/status',
    getAll: 'GET /orders', // For admin dashboard
  },
  
  // File handling
  files: {
    upload: 'POST /files/upload',
    download: 'GET /files/:fileId',
    delete: 'DELETE /files/:fileId',
  },
  
  // Payment processing
  payment: {
    process: 'POST /payment/process',
    verify: 'GET /payment/verify/:paymentId',
    webhook: 'POST /payment/webhook', // For payment gateway webhooks
  },
  
  // Order status tracking
  status: {
    get: 'GET /status/:orderId',
    update: 'POST /status/:orderId',
  },
  
  // Analytics (optional)
  analytics: {
    orders: 'GET /analytics/orders',
    revenue: 'GET /analytics/revenue',
  },
} as const;

// Error codes that your backend should return
export const API_ERROR_CODES = {
  // Client errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  
  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  ORDER_CREATION_FAILED: 'ORDER_CREATION_FAILED',
} as const;