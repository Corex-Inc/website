import { motion } from 'framer-motion';

interface MinecraftLoginButtonProps {
  disabled?: boolean;
  onClick: () => void;
  isProcessing?: boolean;
}

export function MinecraftLoginButton({ disabled, onClick, isProcessing }: MinecraftLoginButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !isProcessing ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isProcessing ? { scale: 0.98 } : {}}
      onClick={onClick}
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
          <img src='/shared/other/login/minecraft.svg' alt="Minecraft" className="h-6" />
        </>
      )}
    </motion.button>
  );
}
