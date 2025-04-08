
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx'

// Import styles
import './index.css'
import './styles/customization/index.css'

// Import components for router
import Index from './pages/Index.tsx';
import Auth from './pages/Auth.tsx';
import NotFound from './pages/NotFound.tsx';
import WidgetLauncher from './pages/WidgetLauncher.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "widgets",
        element: <WidgetLauncher />,
      }
    ],
  },
  // Add a catch-all route for 404 errors
  {
    path: "*",
    element: <NotFound />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
