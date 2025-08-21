interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  factor: 2,
  shouldRetry: (error) => {
    // Retry on network errors or 5xx status codes
    return error.message.includes('ECONNREFUSED') ||
           error.message.includes('ETIMEDOUT') ||
           error.message.includes('ENOTFOUND') ||
           (error as any).statusCode >= 500;
  }
};

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= config.maxRetries!; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === config.maxRetries || !config.shouldRetry!(lastError)) {
        throw lastError;
      }
      
      if (config.onRetry) {
        config.onRetry(lastError, attempt);
      }
      
      const delay = Math.min(
        config.initialDelay! * Math.pow(config.factor!, attempt - 1),
        config.maxDelay!
      );
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.3 * delay;
      const totalDelay = delay + jitter;
      
      console.log(`[RETRY] Attempt ${attempt}/${config.maxRetries} failed, retrying in ${Math.round(totalDelay)}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }
  
  throw lastError!;
}

// Circuit breaker implementation
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000, // 1 minute
    private readonly resetTimeout = 30000 // 30 seconds
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      
      if (timeSinceLastFailure > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }
  
  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      console.error(`[CIRCUIT BREAKER] Opening circuit after ${this.failures} failures`);
    }
  }
  
  private reset() {
    this.failures = 0;
    this.state = 'CLOSED';
    console.log('[CIRCUIT BREAKER] Circuit reset to CLOSED state');
  }
  
  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Request retry wrapper for HTTP clients
export function createRetryableHttpClient(baseClient: any) {
  return {
    async get(url: string, options?: any) {
      return retryWithExponentialBackoff(
        () => baseClient.get(url, options),
        {
          maxRetries: 3,
          onRetry: (error, attempt) => {
            console.log(`[HTTP] GET ${url} failed (attempt ${attempt}):`, error.message);
          }
        }
      );
    },
    
    async post(url: string, data?: any, options?: any) {
      return retryWithExponentialBackoff(
        () => baseClient.post(url, data, options),
        {
          maxRetries: 2, // Fewer retries for POST to avoid duplicates
          shouldRetry: (error) => {
            // Only retry on network errors, not business logic errors
            return error.message.includes('ECONNREFUSED') ||
                   error.message.includes('ETIMEDOUT');
          }
        }
      );
    }
  };
}