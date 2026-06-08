import { type ReactNode, useEffect } from "react";
import { authService } from "@/lib/authService";
import { useAuthStore } from "../useAuthStore";

interface AuthInitializerProps {
  children: ReactNode;
}

function AuthInitializer({ children }: AuthInitializerProps) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'auth:login-complete') return;

      try {
        const cached = authService.restoreSession();

        if (signal.aborted) return;

        if (cached) {
          setUser(cached);
        }

        const fresh = await authService.getProfile();

        if (fresh) {
          setUser(fresh);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Authorization synchronization error: ", error);
        }
      }
    }

    window.addEventListener('message', handleMessage, {
      signal: signal,
    });

    return () => controller.abort();
  }, [setUser]);

  return <>{children}</>
}

export { AuthInitializer };