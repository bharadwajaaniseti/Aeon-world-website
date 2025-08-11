import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { startMSW } from './api/msw/browser';
import './app.css';

// Initialize MSW for API mocking
if (import.meta.env.VITE_USE_MOCKS === 'true') {
  startMSW().catch(console.error);
}

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;