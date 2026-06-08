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

export interface AuthResponse {
  success: boolean;
  profile: UserProfile;
  refreshToken: string;
  accessToken: string;
  message: string;
}