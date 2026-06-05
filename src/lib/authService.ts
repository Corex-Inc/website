import { apiClient } from './api';

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email: string;
  joinedAt: string;
  has_licence?: boolean;
  discordId?: string;
  avatar?: string;
  gameAccounts?: Array<{ id: string; name: string }>;
  username_cooldown?: {
    changeable: boolean;
    available_at: string | null;
    remaining_ms: number;
  };
  connections?: {
    discord?: { id: string; username: string; email?: string; avatar?: string };
    minecraft?: { uuid?: string; username: string };
  };
  data?: {
    likes?: number;
    posts?: number;
    [key: string]: any;
  };
  createdAt?: string;
}

interface AuthResponse {
  success: boolean;
  profile: UserProfile;
  refreshToken: string;
  accessToken: string;
  message: string;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PROFILE: 'userProfile',
} as const;

export const authService = {
  loginDiscord: async (code: string, redirectUri?: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/login/discord', {
      code,
      redirect_uri: redirectUri,
    });
    const authData = response.data as AuthResponse;

    if (authData.success) {
      authService.persistAuth(authData);
    }

    return authData;
  },

  getMinecraftDeviceCode: async () => {
    const response = await apiClient.post('/api/v1/login/minecraft/device');
    return response.data;
  },

  pollMinecraftDeviceStatus: async (deviceCode: string) => {
    const response = await apiClient.post('/api/v1/login/minecraft/device/poll', { deviceCode });
    return response.data;
  },

  loginMinecraft: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.post(`/api/v1/login/minecraft?code=${code}`);
    const authData = response.data as AuthResponse;

    if (authData.success) {
      authService.persistAuth(authData);
    }

    return authData;
  },

  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const response = await apiClient.get('/api/v1/profile');
      const data = response.data as AuthResponse;
      return data?.profile || null;
    } catch (error) {
      return null;
    }
  },

  getSettings: async () => {
    const response = await apiClient.get('/api/v1/settings');
    return response.data;
  },

  updateName: async (name: string) => {
    const response = await apiClient.patch('/api/v1/settings/name', { name });
    return response.data;
  },

  updateUsername: async (username: string) => {
    const response = await apiClient.patch('/api/v1/settings/username', { username });
    return response.data;
  },

  linkDiscord: async (code: string, redirectUri?: string) => {
    const response = await apiClient.post('/api/v1/settings/link/discord', {
      code,
      redirect_uri: redirectUri,
    });
    return response.data;
  },

  linkMinecraftDevice: async (deviceCode: string) => {
    const response = await apiClient.post('/api/v1/settings/link/minecraft', { deviceCode });
    return response.data;
  },

  linkMinecraft: async (code: string) => {
    const response = await apiClient.post('/api/v1/settings/link/minecraft', { code });
    return response.data;
  },

  persistAuth: (authData: AuthResponse & { accessToken?: string; refreshToken?: string }) => {
    if (authData.profile) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(authData.profile));
    }
    if ('accessToken' in authData) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken!);
    }
    if ('refreshToken' in authData) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken!);
    }
  },

  restoreSession: (): UserProfile | null => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return storedProfile ? JSON.parse(storedProfile) : null;
    } catch {
      return null;
    }
  },

  isSessionValid: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    window.location.href = '/';
  }
};
