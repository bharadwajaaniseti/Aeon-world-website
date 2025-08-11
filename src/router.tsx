import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Home } from './routes/Home';
import { Sim } from './routes/Sim';
import { About } from './routes/About';
import { ErrorBoundary } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/sim',
    element: <Sim />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/about',
    element: <About />,
    errorElement: <ErrorBoundary />,
  },
]);