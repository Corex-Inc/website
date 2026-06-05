import { BrowserRouter, Routes, Route, useLocation,  } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './pages/Home';
import Docs from './pages/Documentation';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { AuthProvider } from './contexts/AuthContext';
import { AuthCallback } from './pages/AuthCallback';
import { SettingsPage } from './pages/Settings';

nprogress.configure({ 
  showSpinner: false, 
  speed: 400,
  minimum: 0.2
});

function PageLoader() {
  const location = useLocation();
  const isLoading = false;

  useEffect(() => {
    nprogress.start();
    if (!isLoading) {
      nprogress.done();
    }

    return () => {
      nprogress.done();
    };
  }, [location, isLoading]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageLoader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documentation/*" element={<Docs />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          <Route path="/login/:provider" element={<AuthCallback />} />
          <Route path="/link/:provider" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
