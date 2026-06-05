import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  scaleMul?: {
    in: number;
    out: number;
  };
  children: React.ReactNode;
}

export default function Button({
  size = 'medium',
  variant = 'secondary',
  scaleMul = {in: 0, out: 0},
  children,
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-white text-surface-950',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    ghost: 'text-white hover:bg-white/10',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 + scaleMul.in }}
      whileTap={{ scale: 0.95 + scaleMul.out }}
      className={`flex items-center gap-2 font-semibold rounded-xl transition-all duration-300 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}