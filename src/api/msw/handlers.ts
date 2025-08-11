import { http, HttpResponse } from 'msw';

// Basic handlers for MSW (extending mock adapter functionality)
export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  }),

  // Catch-all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn('Unhandled MSW request:', request.method, request.url);
    return HttpResponse.json(
      { error: { code: 'NOT_IMPLEMENTED', message: 'Endpoint not yet implemented in MSW' } },
      { status: 501 }
    );
  }),
];