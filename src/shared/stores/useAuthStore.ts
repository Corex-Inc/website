import { create } from "zustand"
import { authService } from "@/shared/services/authService"
import type { UserProfile } from "../types/auth.types";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (data: {
    accessToken: string;
    refreshToken: string;
    profile: UserProfile
  }) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  initAuth: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  initAuth: async () => {
    set({ isLoading: true });

    const cachedProfile = authService.restoreSession();
    if (cachedProfile) {
      set({ user: cachedProfile, isAuthenticated: true });
    }

    set({ isLoading: false });

    if (!authService.isSessionValid()) return;

    try {
      const freshProfile = await authService.getProfile();

      if (freshProfile) {
        set({ user: freshProfile, isAuthenticated: true });
      } else if (!cachedProfile) {
        get().logout();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (!cachedProfile) {
          get().logout();
        }
      }
    }
  },

  login: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userProfile', JSON.stringify(
      data.profile
    ));

    set({ user: data.profile, isAuthenticated: true });
  },

  refreshProfile: async () => {
    try {
      const profile = await authService.getProfile();

      if (profile) {
        localStorage.setItem('userProfile', JSON.stringify(
          profile
        ))

        set({ user: profile, isAuthenticated: true })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to update profile: ", error)
      }
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    authService.logout();
  },
}));

export { useAuthStore };