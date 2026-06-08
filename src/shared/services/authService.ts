import { STORAGE_KEYS } from "../constants/auth.constants";

import { apiClient } from "../lib/api";
import type { AuthResponse, UserProfile } from "../types/auth.types";

class AuthService {

  async loginDiscord(code: string, redirectUri?: string): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/login/discord', {
      code,
      redirect_uri: redirectUri,
    });
    const authData = response.data as AuthResponse;

    if (authData.success) {
      authService.persistAuth(authData);
    }

    return authData;
  }

  async getMinecraftDeviceCode() {
    const response = await apiClient.post('/api/v1/login/minecraft/device');
    return response.data;
  }

  async pollMinecraftDeviceStatus(deviceCode: string) {
    const response = await apiClient.post('/api/v1/login/minecraft/device/poll', { deviceCode });
    return response.data;
  }

  async loginMinecraft(code: string): Promise<AuthResponse> {
    const response = await apiClient.post(`/api/v1/login/minecraft?code=${code}`);
    const authData = response.data as AuthResponse;

    if (authData.success) {
      authService.persistAuth(authData);
    }

    return authData;
  }

  async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get('/api/v1/profile');
      const data = response.data as AuthResponse;
      return data?.profile || null;
    } catch {
      return null;
    }
  }

  async getSettings() {
    const response = await apiClient.get('/api/v1/settings');
    return response.data;
  }

  async updateName(name: string) {
    const response = await apiClient.patch('/api/v1/settings/name', { name });
    return response.data;
  }

  async updateUsername(username: string) {
    const response = await apiClient.patch('/api/v1/settings/username', { username });
    return response.data;
  }

  async linkDiscord(code: string, redirectUri?: string) {
    const response = await apiClient.post('/api/v1/settings/link/discord', {
      code,
      redirect_uri: redirectUri,
    });
    return response.data;
  }

  async linkMinecraftDevice(deviceCode: string) {
    const response = await apiClient.post('/api/v1/settings/link/minecraft', { deviceCode });
    return response.data;
  }

  async linkMinecraft(code: string) {
    const response = await apiClient.post('/api/v1/settings/link/minecraft', { code });
    return response.data;
  }

  persistAuth(authData: AuthResponse & { accessToken?: string; refreshToken?: string }) {
    if (authData.profile) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(authData.profile));
    }
    if ('accessToken' in authData) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
    }
    if ('refreshToken' in authData) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
    }
  }

  restoreSession(): UserProfile | null {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return storedProfile ? JSON.parse(storedProfile) : null;
    } catch {
      return null;
    }
  }

  isSessionValid(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    window.location.href = '/';
  }
}

export const authService = new AuthService();