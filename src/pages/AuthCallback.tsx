import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CorexLoader } from '@/components/shared/loading/corex';
import Button from '@/shared/components/Button';
import { authService } from '@/shared/services/authService';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const [error, setError] = useState<string | null>(null);

  const hasRun = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const code = searchParams.get('code');
      const provider = location.pathname.split('/').pop();

      const mode: 'link' | 'login' = location.pathname.startsWith('/link') ? 'link' : 'login';

      const redirectUri = `${window.location.origin}/${mode}/${provider}`;

      const isPopup = !!window.opener && window.opener !== window;

      if (!code) {
        setError('No authorization code provided.');
        return;
      }

      try {
        if (mode === 'link') {
          if (provider === 'discord') {
            await authService.linkDiscord(code, redirectUri);
          } else if (provider === 'minecraft') {
            await authService.linkMinecraft(code);
          }

          if (isPopup) {
            window.opener.postMessage(
              { type: 'auth:link-complete', provider },
              window.location.origin
            );
            window.close();
            return;
          }

          await refreshProfile();
          navigate('/settings');
          return;
        }

        // biome-ignore lint/suspicious/noExplicitAny: Axios response data -> Any
        let res: any;
        if (provider === 'discord') {
          res = await authService.loginDiscord(code, redirectUri);
        } else if (provider === 'minecraft') {
          res = await authService.loginMinecraft(code);
        }

        if (!res?.success || !res.accessToken) {
          setError(`Login failed: ${res?.message || 'Unknown error'}`);
          return;
        }

        if (isPopup) {
          window.opener.postMessage(
            { type: 'auth:login-complete', provider },
            window.location.origin
          );
          window.close();
          return;
        }

        login(res);
        navigate('/');
      // biome-ignore lint/suspicious/noExplicitAny:-
      } catch (err: any) {
        console.error('Auth error:', err);
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Authentication failed';

        if (isPopup) {
          window.opener.postMessage(
            { type: 'auth:error', message },
            window.location.origin
          );
          window.close();
          return;
        }
        setError(message);
      }
    };

    handleAuth();
  }, [searchParams, location.pathname, navigate, login, refreshProfile]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950 text-white">
        <div className="rounded-xl border border-red-800/20 bg-red-800/5 p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Authentication Error</h2>
          <p className="text-gray-300">{error}</p>
          <Button
            className="mt-4 px-4 py-2"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 text-white">
      <div className="flex flex-col items-center">
        <CorexLoader />
        <p className="text-white">Authenticating</p>
      </div>
    </div>
  );
}
