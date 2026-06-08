import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface AboutSettingsProps {
  about?: string;
  onDirty: (key: string, dirty: boolean, save: () => Promise<void>) => void;
}

const MAX_ABOUT_LENGTH = 350;

export default function AboutSettings({ about: initialAbout, onDirty }: AboutSettingsProps) {
  const [about, setAbout] = useState(initialAbout || '');
  const [savedAbout, setSavedAbout] = useState(initialAbout || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(e.target.value.slice(0, MAX_ABOUT_LENGTH));
  };

  const save = useCallback(async () => {
    try {
      await apiClient.patch('api/v1/settings/about', { about: about.trim() });
      setSavedAbout(about.trim());
    } catch (err: any) {
      console.error('Failed to update about:', err);
    }
  }, [about.trim]);

  const isChanged = about.trim() !== savedAbout;
  const charCount = about.trim().length;
  const charPercentage = (charCount / MAX_ABOUT_LENGTH) * 100;

  useEffect(() => {
    onDirty('about', isChanged, save);
  }, [isChanged, onDirty, save]);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-white">About Me</h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="bio" className="text-sm font-medium text-surface-300">Bio</label>
          <span className={`text-xs ${charCount > MAX_ABOUT_LENGTH * 0.9 ? 'text-amber-400' : 'text-surface-500'}`}>
            {charCount} / {MAX_ABOUT_LENGTH}
          </span>
        </div>

        <textarea
          value={about}
          id="bio"
          onChange={handleChange}
          placeholder="Write something about yourself..."
          rows={5}
          className="w-full px-3 py-2.5 rounded-lg bg-surface-900 border border-white/10 focus:border-gray-200/50 focus:outline-none text-white placeholder-surface-500 resize-none transition-colors text-sm leading-relaxed"
        />

        <div className="h-0.5 bg-surface-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              charPercentage > 90 ? 'bg-red-500' : charPercentage > 70 ? 'bg-amber-500' : 'bg-white'
            }`}
            style={{ width: `${Math.min(charPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
