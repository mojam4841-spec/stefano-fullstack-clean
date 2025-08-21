// Sentry is temporarily disabled - will be re-enabled when needed
// import * as Sentry from "@sentry/react";

export function initSentry() {
  // Sentry disabled temporarily
  console.log('Sentry monitoring disabled');
}

export function captureError(error: Error, context?: any) {
  console.error('Error captured:', error, context);
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`Message [${level}]:`, message);
}