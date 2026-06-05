import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '../lib/authService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { accessToken: string; refreshToken: string; profile: UserProfile }) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const cachedProfile = authService.restoreSession();

      if (cachedProfile) {
        setUser(cachedProfile);
      }

      setIsLoading(false);

      if (!authService.isSessionValid()) {
        return;
      }

      try {
        const freshProfile = await authService.getProfile();
        if (freshProfile) {
          setUser(freshProfile);
        } else if (!cachedProfile) {
          authService.logout();
        }
      } catch (error) {
        if (!cachedProfile) {
          authService.logout();
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'auth:login-complete') return;

      const cached = authService.restoreSession();
      if (cached) setUser(cached);

      try {
        const fresh = await authService.getProfile();
        if (fresh) setUser(fresh);
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const login = (data: { accessToken: string; refreshToken: string; profile: UserProfile }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userProfile', JSON.stringify(data.profile));
    setUser(data.profile);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setUser(profile);
      }
    } catch (error) {
      console.error('Failed to refresh profile', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
