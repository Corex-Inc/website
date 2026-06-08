import 'nprogress/nprogress.css';
import nprogress from 'nprogress';
import { useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthCallback } from './pages/AuthCallback';
import Docs from './pages/Documentation';
import DocumentsLayout from './pages/documents/DocumentsLayout';
import PrivacyPolicy from './pages/documents/PrivacyPolicy';
import TermsOfService from './pages/documents/TermsOfService';
import { HomePage } from './pages/Home';
import { MetaPage } from './pages/meta/MetaPage';
import { SettingsPage } from './pages/Settings';
import { AuthInitializer } from './shared/stores/auth/AuthInitializer';
import { useAuthStore } from './shared/stores/useAuthStore';

nprogress.configure({ 
  showSpinner: false, 
  speed: 400,
  minimum: 0.2
});

function AppRoot() {
  const location = useLocation();
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const _currentPath = location.pathname;

    nprogress.start();

    if (!isLoading) {
      nprogress.done();
    }

    return () => {
      nprogress.done();
    };
  }, [location.pathname, isLoading]);

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "meta",
        element: <MetaPage />,
      },
      {
        path: "documentation/*",
        element: <Docs />,
      },
      {
        path: "login/:provider",
        element: <AuthCallback />,
      },
      {
        path: "link/:provider",
        element: <AuthCallback />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "settings",
            element: <SettingsPage />,
          }
        ]
      },
      {
        path: "documents",
        element: <DocumentsLayout />,
        children: [
          {
            index: true,
            element: <TermsOfService />,
          },
          {
            path: "terms",
            element: <TermsOfService />,
          },
          {
            path: "privacy",
            element: <PrivacyPolicy />,
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}

export default App;
