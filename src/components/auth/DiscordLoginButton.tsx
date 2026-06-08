import { motion } from 'framer-motion';
import { useRef } from 'react';

interface DiscordLoginButtonProps {
  disabled?: boolean;
  onClick: () => void;
  isProcessing?: boolean;
}

const CLIENT_ID = '1510655714056605706';

export function DiscordLoginButton({ disabled, onClick, isProcessing }: DiscordLoginButtonProps) {
  const popupRef = useRef<Window | null>(null);

  const openDiscordPopup = () => {
    const redirectUri = `${window.location.origin}/login/discord`;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=guilds.join+identify+email`;

    const width = 500;
    const height = 750;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    popupRef.current = window.open(discordAuthUrl, 'discord_oauth', `width=${width},height=${height},left=${left},top=${top}`);
    onClick();
  };

  return (
    <motion.button
      whileHover={!disabled && !isProcessing ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isProcessing ? { scale: 0.98 } : {}}
      onClick={openDiscordPopup}
      disabled={disabled || isProcessing}
      className={`
        group relative flex w-full items-center justify-center gap-3 overflow-hidden
        bg-white/10 text-white border border-white/20
        px-8 py-4 text-lg font-semibold rounded-full transition-all
        ${(disabled || isProcessing) ? 'opacity-70 cursor-wait' : 'hover:bg-white/20'}
      `}
    >
      {isProcessing ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          <span>Log in via</span>
          <img src='/shared/other/login/discord.webp' alt="Discord" className="h-[21px]" />
        </>
      )
      }
    </motion.button>
  );
}
