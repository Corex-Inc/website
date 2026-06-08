import { ArrowDown } from 'lucide-react';
import { HERO_BUTTONS } from '@/shared/constants/constants';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-surface-500/[0.04] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
          Scripting,{' '}
          <span className="bg-gradient-to-b from-surface-200 to-surface-500 bg-clip-text text-transparent">
            compiled
          </span>
        </h1>

        <p className="animate-fade-in-up [animation-delay:0.1s] mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed">
          A high-performance, compiled scripting engine for Minecraft servers.
          Simple, automated, convenient — meet Corex.
        </p>

        <div className="animate-fade-in-up [animation-delay:0.2s] mt-10 flex flex-wrap items-center justify-center gap-3">
          {HERO_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const cls =
              btn.style === 'primary'
                ? 'btn-primary'
                : btn.style === 'secondary'
                  ? 'btn-secondary'
                  : 'btn-ghost';
            return (
              <a key={btn.label} href={btn.href} className={`${cls} flex items-center gap-2`}>
                <Icon className="w-4 h-4" /> {btn.label}
              </a>
            );
          })}
        </div>

        <div className="animate-fade-in [animation-delay:0.5s] mt-20 flex justify-center">
          <a href="#features" className="text-surface-600 hover:text-surface-400 transition-colors animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
