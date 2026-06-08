/** biome-ignore-all lint/suspicious/noExplicitAny:- */
import { AlertTriangle, Check, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import nprogress from 'nprogress';
import { useCallback, useEffect, useRef, useState } from 'react';
import Modal from '@/shared/components/Modal';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { authService } from '@/shared/services/authService';
import { DiscordLoginButton } from '../auth/DiscordLoginButton';
import { MinecraftLoginButton } from '../auth/MinecraftLoginButton';
import { CorexLoader } from './loading/corex';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeviceFlowData {
  user_code: string;
  device_code: string;
  verification_uri: string;
  interval: number;
  expires_in: number;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deviceFlow, setDeviceFlow] = useState<DeviceFlowData | null>(null);
  const [copied, setCopied] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);
  const pollIntervalRef = useRef<any>(null);

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data) return;

      if (data.type === 'auth:login-complete') {
        setIsProcessing(false);
        nprogress.done();
        onClose();
      } else if (data.type === 'auth:error') {
        setIsProcessing(false);
        nprogress.done();
        setFlowError(data.message || 'Authentication failed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopPolling();
      setDeviceFlow(null);
      setFlowError(null);
      setCopied(false);
      setIsProcessing(false);
    }
    return () => stopPolling();
  }, [isOpen, stopPolling]);


  const startPolling = (data: DeviceFlowData) => {
    stopPolling();
    const intervalSec = data.interval || 5;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await authService.pollMinecraftDeviceStatus(data.device_code);
        if (response.success) {
          if (response.status === 'success') {
            stopPolling();
            setDeviceFlow(null);
            login({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              profile: response.profile
            });
            onClose();
          } else if (response.status === 'expired') {
            stopPolling();
            setFlowError('The activation session has expired. Please try again.');
          }
        }
      } catch (err: any) {
        const errorData = err.response?.data;
        if (errorData?.code === 'NO_MINECRAFT_LICENSE' || err.response?.status === 403) {
          stopPolling();
          setFlowError('Your Microsoft account does not have a valid Minecraft license.');
        } else if (err.response?.status !== 400) {
          console.error('Polling error', err);
        }
      }
    }, intervalSec * 1000);
  };


  const handleMinecraftDeviceFlow = async () => {
    setIsProcessing(true);
    setFlowError(null);
    nprogress.start();
    try {
      const data = await authService.getMinecraftDeviceCode();
      if (data.success && data.user_code) {
        setDeviceFlow(data);
        startPolling(data);
      } else {
        throw new Error(data.message || 'Failed to request device flow code');
      }
    } catch (err: any) {
      console.error(err);
      setFlowError(err.response?.data?.message || err.message || 'Error requesting device authentication.');
    } finally {
      setIsProcessing(false);
      nprogress.done();
    }
  };

  const handleCopyCode = () => {
    if (!deviceFlow) return;
    navigator.clipboard.writeText(deviceFlow.user_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} title="">
      <div className="relative -mx-6 -mt-10 mb-8 h-48 overflow-hidden rounded-t-[30px]">
        <img 
          src='/shared/other/login/loginbanner.webp'
          alt="Banner" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      <div className="flex flex-col items-center px-2 pb-4">
        {deviceFlow ? (
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white font-unbounded">Link Your Microsoft Account</h2>
              <p className="text-gray-400 text-sm mt-1">Follow the instructions to log in</p>
            </div>

            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 space-y-4 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-sm">
                  <p className="text-surface-200">Open Microsoft activation link:</p>
                  <a 
                    href={deviceFlow.verification_uri} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline mt-1"
                  >
                    {deviceFlow.verification_uri}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-sm w-full">
                  <p className="text-surface-200">Enter this code on the page:</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-2 p-2 bg-black/40 rounded-xl border border-white/5 font-mono">
                    <span className="text-xl font-bold tracking-widest text-white px-2 select-all">
                      {deviceFlow.user_code}
                    </span>
                    <button 
                      onClick={handleCopyCode}
                      type="button"
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-surface-400 hover:text-white"
                      title="Copy code"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {flowError ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{flowError}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-surface-400 text-sm py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Waiting for your authorization...</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  stopPolling();
                  setDeviceFlow(null);
                  setFlowError(null);
                }}
                className="flex-1 py-3 text-sm font-semibold rounded-full border border-white/10 hover:bg-white/5 transition-colors text-surface-300"
              >
                Go Back
              </button>
              {flowError && (
                <button
                  onClick={handleMinecraftDeviceFlow}
                  type="button"
                  className="flex-1 py-3 text-sm font-semibold rounded-full bg-emerald-500 text-surface-950 hover:bg-emerald-400 transition-colors"
                >
                  Retrieve New Code
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8 flex flex-col items-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white font-unbounded">Log in to Corex</h2>
              <p className="text-gray-400 text-sm mt-1">Use your Discord or Microsoft Account</p>
            </div>

            {flowError && (
              <div className="w-full flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{flowError}</p>
              </div>
            )}

            <div className="w-full space-y-4">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <CorexLoader />
                  <p className="text-gray-200">Processing your data</p>
                </div>
              ) : (
                <>
                  <MinecraftLoginButton
                    disabled={isProcessing}
                    onClick={handleMinecraftDeviceFlow}
                    isProcessing={isProcessing}
                  />
                  <DiscordLoginButton
                    disabled={isProcessing}
                    onClick={() => setIsProcessing(true)}
                    isProcessing={isProcessing}
                  />
                </>
              )}
            </div>

            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest mt-4" type="button">
              Back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}