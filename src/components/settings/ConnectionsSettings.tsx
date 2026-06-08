/** biome-ignore-all lint/suspicious/noExplicitAny:- */
import { AlertTriangle, Check, Copy, RefreshCw } from 'lucide-react';
import nprogress from 'nprogress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authService } from '@/lib/authService';
import Button from '@/shared/components/Button';
import Link from '@/shared/components/Link';

const CLIENT_ID = '1510655714056605706';

interface DeviceFlowData {
  user_code: string;
  device_code: string;
  verification_uri: string;
  interval: number;
  expires_in: number;
}

interface ConnectionsSettingsProps {
  settings: any;
  onRefresh: () => void;
}

export default function ConnectionsSettings({ settings, onRefresh }: ConnectionsSettingsProps) {
  const [minecraftDeviceFlow, setMinecraftDeviceFlow] = useState<DeviceFlowData | null>(null);
  const [minecraftLinking, setMinecraftLinking] = useState(false);
  const [minecraftLinkError, setMinecraftLinkError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollIntervalRef = useRef<any>(null);

  const stopMinecraftPoll = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startMinecraftLinkPoll = (data: DeviceFlowData) => {
    stopMinecraftPoll();
    const intervalSec = data.interval || 5;
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await authService.linkMinecraftDevice(data.device_code);
        if (response.success) {
          stopMinecraftPoll();
          setMinecraftDeviceFlow(null);
          nprogress.start();
          onRefresh();
          nprogress.done();
        }
      } catch (err: any) {
        const errorData = err.response?.data;
        const status = err.response?.status;
        if (status === 400) {
          const errMsg = errorData?.message?.toLowerCase() || '';
          if (errMsg.includes('expired')) {
            stopMinecraftPoll();
            setMinecraftLinkError('The authorization session has expired. Please try again.');
          }
          return;
        }
        if (status === 403 || errorData?.code === 'NO_MINECRAFT_LICENSE') {
          stopMinecraftPoll();
          setMinecraftLinkError('Your Microsoft account does not own a valid Minecraft license.');
        } else {
          stopMinecraftPoll();
          setMinecraftLinkError(errorData?.message || 'Failed to establish connection with Minecraft.');
        }
      }
    }, intervalSec * 1000);
  };

  const handleLinkDiscord = () => {
    const redirectUri = `${window.location.origin}/link/discord`;
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=guilds.join+identify+email`;
    const width = 500, height = 750;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(url, 'discord_oauth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleLinkMinecraft = async () => {
    setMinecraftLinking(true);
    setMinecraftLinkError(null);
    nprogress.start();
    try {
      const data = await authService.getMinecraftDeviceCode();
      if (data.success && data.user_code) {
        setMinecraftDeviceFlow(data);
        startMinecraftLinkPoll(data);
      } else {
        throw new Error(data.message || 'Failed to initiate Microsoft device link.');
      }
    } catch (err) {
      if (!(err instanceof Error)) return;
      setMinecraftLinkError(err.message || 'Error occurred starting Minecraft link.');
    } finally {
      setMinecraftLinking(false);
      nprogress.done();
    }
  };

  const handleCancelMinecraftLink = () => {
    stopMinecraftPoll();
    setMinecraftDeviceFlow(null);
    setMinecraftLinkError(null);
  };

  const handleCopyCode = () => {
    if (!minecraftDeviceFlow) return;
    navigator.clipboard.writeText(minecraftDeviceFlow.user_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => () => stopMinecraftPoll(), [stopMinecraftPoll]);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
      <p className="text-sm text-surface-400">
        Link external accounts to unlock features and streamline your experience.
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-surface-900/20 border border-white/10 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-[#5865f2]/15 rounded-lg border border-[#5865f2]/20">
              <img src="/shared/other/discord_logo.svg" alt="Discord" className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Discord</p>
              <p className="text-xs text-surface-400">
                {settings?.connections?.discord
                  ? `Connected as ${settings.connections.discord.username}`
                  : 'Not connected yet'}
              </p>
            </div>
          </div>
          {settings?.connections?.discord ? (
            <span className="px-2.5 py-1 bg-white/15 text-gray-300 text-xs font-semibold rounded-full border border-white/25">
              Connected
            </span>
          ) : (
            <Button
              onClick={handleLinkDiscord}
              size='small'
              variant='primary'
              className="px-3 py-1.5 text-black text-xs font-semibold rounded-lg transition-colors"
            >
              Link
            </Button>
          )}
        </div>

        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-surface-900/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-green-500/10 rounded-lg border border-green-500/20">
                <img src="/shared/other/minecraft_logo.svg" alt="Minecraft" className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Minecraft</p>
                <p className="text-xs text-surface-400">
                  {settings?.connections?.minecraft
                    ? `Connected as ${settings.connections.minecraft.username}`
                    : 'Not connected yet'}
                </p>
              </div>
            </div>
            {settings?.connections?.minecraft ? (
              <span className="px-2.5 py-1 bg-white/15 text-gray-300 text-xs font-semibold rounded-full border border-white/25">
                Connected
              </span>
            ) : !minecraftDeviceFlow ? (
              <Button
                onClick={handleLinkMinecraft}
                size='small'
                variant='primary'
                disabled={minecraftLinking}
                className="px-3 py-1.5 disabled:opacity-50 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                {minecraftLinking ? 'Loading...' : 'Link'}
              </Button>
            ) : null}
          </div>

          {minecraftDeviceFlow && (
            <div className="px-4 py-4 bg-surface-950 border-t border-white/5 space-y-4">
              <div className="bg-surface-900/20 p-4 rounded-lg border border-white/5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/20 border border-gray-500/30 text-white text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div className="flex-2 text-sm text-surface-300">
                    <p className="mb-2">Open this link in a new tab:</p>
                    <Link href={minecraftDeviceFlow.verification_uri} isExternal={true}>
                      {minecraftDeviceFlow.verification_uri}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/20 border border-gray-500/30 text-white text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div className="flex-1 text-sm text-surface-300">
                    <p className="mb-2">Enter this code:</p>
                    <button
                      onClick={handleCopyCode}
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 bg-surface-950 hover:bg-black border border-white/10 rounded-lg font-mono font-bold text-white tracking-widest transition-colors text-sm"
                    >
                      {minecraftDeviceFlow.user_code}
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {minecraftLinkError ? (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{minecraftLinkError}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-surface-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Waiting for verification...</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleCancelMinecraftLink}
                  scaleMul={{in: -0.04, out: 0.03}}
                  className="flex-1 px-4 py-2 border border-white/15 hover:bg-white/5 text-surface-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </Button>
                {minecraftLinkError && (
                  <button
                    onClick={handleLinkMinecraft}
                    type="button"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
