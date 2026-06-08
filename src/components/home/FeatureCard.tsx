import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useInView } from '@/shared/hooks/useInView';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  const { ref, visible } = useInView();
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      <section
        ref={divRef}
        role="region"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-xl border border-surface-800/50 bg-surface-900/50 p-6 transition-colors duration-300 hover:border-surface-700 hover:bg-surface-900/80"
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />

        <div className="relative z-10">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 transition-colors duration-300 group-hover:bg-surface-700">
            <Icon className="h-5 w-5 text-surface-300 transition-colors duration-300 group-hover:text-surface-100" />
          </div>
          <h3 className="mb-2 font-semibold font-unbounded text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-surface-400">{description}</p>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)`,
          }}
        />
      </section>
    </motion.div>
  );
}
