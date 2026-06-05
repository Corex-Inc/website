import { useState, useEffect } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ProfileSettingsProps {
  avatar?: string;
  username?: string;
  name?: string;
  onDirty: (key: string, dirty: boolean, save: () => Promise<void>) => void;
}

type AvatarError = 'INVALID_FORMAT' | 'INVALID_LENGTH' | 'INVALID_CHARS' | null;
type UsernameError = 'INVALID' | 'DOUBLE_DOT' | null;
type NameError = 'TOO_SHORT' | 'TOO_LONG' | null;

const MINECRAFT_USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;
const SKIN_HASH_REGEX = /^[a-f0-9]{64}$/;
const USERNAME_RE = /^[A-Za-z0-9_.]{2,32}$/;
const MAX_NAME_LENGTH = 32;
const MIN_NAME_LENGTH = 1;

function getAvatarHeadUrl(value: string): string | null {
  if (!value.trim()) return null;
  const trimmed = value.trim();
  if (MINECRAFT_USERNAME_REGEX.test(trimmed) || SKIN_HASH_REGEX.test(trimmed)) {
    return `https://avatars.spworlds.ru/face/${encodeURIComponent(trimmed)}`;
  }
  return null;
}

export default function ProfileSettings({ avatar: initialAvatar, username: initialUsername, name: initialName, onDirty }: ProfileSettingsProps) {
  const [avatar, setAvatar] = useState(initialAvatar || '');
  const [savedAvatar, setSavedAvatar] = useState(initialAvatar || '');
  const [avatarError, setAvatarError] = useState<AvatarError>(null);

  const [username, setUsername] = useState(initialUsername || '');
  const [savedUsername, setSavedUsername] = useState(initialUsername || '');
  const [usernameError, setUsernameError] = useState<UsernameError>(null);

  const [name, setName] = useState(initialName || '');
  const [savedName, setSavedName] = useState(initialName || '');
  const [nameError, setNameError] = useState<NameError>(null);

  const [loading, setLoading] = useState(false);

  const validateAvatar = (value: string): AvatarError => {
    if (!value.trim()) return null;
    const trimmed = value.trim();
    if (MINECRAFT_USERNAME_REGEX.test(trimmed) || SKIN_HASH_REGEX.test(trimmed)) return null;
    if (trimmed.length < 3 || trimmed.length > 64) return 'INVALID_LENGTH';
    if (trimmed.length >= 3 && trimmed.length <= 16) return 'INVALID_CHARS';
    return 'INVALID_FORMAT';
  };

  const validateUsername = (value: string): UsernameError => {
    if (!value.trim()) return null;
    const trimmed = value.trim();
    if (trimmed.includes('..')) return 'DOUBLE_DOT';
    if (!USERNAME_RE.test(trimmed)) return 'INVALID';
    return null;
  };

  const validateName = (value: string): NameError => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.length < MIN_NAME_LENGTH) return 'TOO_SHORT';
    if (trimmed.length > MAX_NAME_LENGTH) return 'TOO_LONG';
    return null;
  };

  const isAvatarChanged = avatar.trim() !== savedAvatar;
  const isAvatarValid = !validateAvatar(avatar);
  const isUsernameChanged = username.trim() !== savedUsername;
  const isUsernameValid = !validateUsername(username) && username.trim().length >= 2;
  const isNameChanged = name.trim() !== savedName;
  const isNameValid = !validateName(name);

  const saveAvatar = async () => {
    const err = validateAvatar(avatar);
    if (err) { setAvatarError(err); return; }
    setLoading(true);
    try {
      await apiClient.patch('/api/v1/settings/avatar', { avatar: avatar.trim() });
      setSavedAvatar(avatar.trim());
    } catch {
      setAvatarError('INVALID_FORMAT');
    } finally {
      setLoading(false);
    }
  };

  const saveUsername = async () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    setLoading(true);
    try {
      await apiClient.patch('/api/v1/settings/username', { username: username.trim() });
      setSavedUsername(username.trim());
    } catch {
      setUsernameError('INVALID');
    } finally {
      setLoading(false);
    }
  };

  const saveName = async () => {
    const err = validateName(name);
    if (err) { setNameError(err); return; }
    setLoading(true);
    try {
      await apiClient.patch('/api/v1/settings/name', { name: name.trim() });
      setSavedName(name.trim());
    } catch {
      setNameError('TOO_LONG');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onDirty('avatar', isAvatarChanged && isAvatarValid, saveAvatar);
  }, [avatar, savedAvatar]);

  useEffect(() => {
    onDirty('username', isUsernameChanged && isUsernameValid, saveUsername);
  }, [username, savedUsername]);

  useEffect(() => {
    onDirty('name', isNameChanged && isNameValid, saveName);
  }, [name, savedName]);

  const avatarErrorMsg = () => {
    switch (avatarError) {
      case 'INVALID_LENGTH': return 'Username must be 3-16 chars, or skin hash must be 64 chars';
      case 'INVALID_CHARS': return 'Username can only contain letters, numbers, and underscores';
      case 'INVALID_FORMAT': return 'Enter a valid Minecraft username (3-16 chars) or skin hash (64 hex chars)';
      default: return '';
    }
  };

  const usernameErrorMsg = () => {
    switch (usernameError) {
      case 'DOUBLE_DOT': return 'Username cannot contain two consecutive dots';
      case 'INVALID': return 'Username must be 2-32 characters: letters, digits, "_" or "."';
      default: return '';
    }
  };

  const nameErrorMsg = () => {
    switch (nameError) {
      case 'TOO_SHORT': return 'Display name is too short';
      case 'TOO_LONG': return `Display name cannot exceed ${MAX_NAME_LENGTH} characters`;
      default: return '';
    }
  };

  const headUrl = getAvatarHeadUrl(savedAvatar || avatar);

  const inputClass = (hasError: boolean, isOk: boolean) =>
    `w-full px-3 py-2.5 rounded-lg bg-surface-900 border transition-colors focus:outline-none text-sm text-white placeholder-surface-500 ${
      hasError
        ? 'border-red-500/50 focus:border-red-400'
        : isOk
        ? 'border-emerald-500/40 focus:border-gray-200/50'
        : 'border-white/10 focus:border-gray-200/50'
    }`;

  return (
    <>
      <div className="space-y-7">
        <h2 className="text-lg font-semibold text-white">Profile</h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-surface-300">
              Minecraft Username or Skin Hash
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center">
              {headUrl ? (
                <img
                  src={headUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-contain select-none"
                  draggable='false'
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="w-7 h-7 rounded bg-surface-700" />
              )}
            </div>

            <div className='flex-1'>
              <input
                type="text"
                value={avatar}
                onChange={(e) => {
                  setAvatar(e.target.value);
                  setAvatarError(validateAvatar(e.target.value));
                }}
                placeholder="e.g., Notch or 64-char skin hash"
                className={inputClass(!!avatarError, !avatarError && avatar.trim() !== '' && isAvatarValid) + ' font-medium flex-1'}
              />

              {avatarError ? (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3 h-3" />
                  {avatarErrorMsg()}
                </p>
              ) : !avatarError && avatar && isAvatarValid ? (
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                  <Check className="w-3 h-3" />
                  Valid format
                </p>
              ) : null}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-surface-300">Username</label>
              <span className={`text-xs ${username.trim().length > 27 ? 'text-amber-400' : 'text-surface-500'}`}>
                {username.trim().length} / 32
              </span>
            </div>
            <div className={`flex items-stretch rounded-lg bg-surface-900 border transition-colors overflow-hidden ${
              usernameError
                ? 'border-red-500/50 focus-within:border-red-400'
                : !usernameError && isUsernameChanged && isUsernameValid
                ? 'border-emerald-500/40 focus-within:border-gray-200/50'
                : 'border-white/10 focus-within:border-gray-200/50'
            }`}>
              <span className="flex items-center pl-3 pr-2 text-sm text-surface-500 font-unbounded select-none border-r border-white/10">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.slice(0, 32));
                  setUsernameError(validateUsername(e.target.value));
                }}
                placeholder="steve_42"
                className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-sm font-medium text-white placeholder-surface-500"
              />
            </div>
            {usernameError ? (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {usernameErrorMsg()}
              </p>
            ) : isUsernameChanged && isUsernameValid ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Valid username
              </p>
            ) : (
              <p className="text-xs text-surface-500">Letters, digits, _ or .</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-surface-300">Display Name</label>
              <span className={`text-xs ${name.trim().length > MAX_NAME_LENGTH * 0.85 ? 'text-amber-400' : 'text-surface-500'}`}>
                {name.trim().length} / {MAX_NAME_LENGTH}
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, MAX_NAME_LENGTH));
                setNameError(validateName(e.target.value));
              }}
              placeholder="e.g., Steve the Builder"
              className={inputClass(!!nameError, !nameError && isNameChanged && isNameValid)}
            />
            {nameError ? (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {nameErrorMsg()}
              </p>
            ) : isNameChanged && isNameValid && name.trim() ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Valid display name
              </p>
            ) : (
              <p className="text-xs text-surface-500">Shown publicly on your profile</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}