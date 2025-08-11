import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function startMSW() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    await worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🔄 MSW started for API mocking');
  }
}