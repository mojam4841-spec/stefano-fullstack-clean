import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface AppError extends Error {
  statusCode?: number;
  errorId?: string;
  correlationId?: string;
  isOperational?: boolean;
  details?: any;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  errorId: string;
  correlationId: string;
  isOperational: boolean;
  details?: any;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorId = uuidv4();
    this.correlationId = '';
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate error tracking IDs
  const errorId = err.errorId || uuidv4();
  const correlationId = err.correlationId || req.headers['x-correlation-id'] || uuidv4();

  // Log error with context
  console.error('[ERROR]', {
    errorId,
    correlationId,
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  // Send error response
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  res.status(statusCode).json({
    error: {
      id: errorId,
      correlationId,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details
      })
    }
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Common error types
export const ErrorTypes = {
  ValidationError: (message: string, details?: any) => 
    new ApiError(400, message, true, details),
  
  UnauthorizedError: (message = 'Unauthorized') => 
    new ApiError(401, message, true),
  
  ForbiddenError: (message = 'Forbidden') => 
    new ApiError(403, message, true),
  
  NotFoundError: (resource: string) => 
    new ApiError(404, `${resource} not found`, true),
  
  ConflictError: (message: string) => 
    new ApiError(409, message, true),
  
  RateLimitError: (message = 'Too many requests') => 
    new ApiError(429, message, true),
  
  InternalError: (message = 'Internal server error') => 
    new ApiError(500, message, false)
};