import { useInView } from '@/shared/hooks/useInView';
import { PLATFORMS } from '../../data/constants';

export default function Platforms() {
  const { ref, visible } = useInView();

  return (
    <section id="platforms" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-surface-500 text-sm font-medium uppercase tracking-widest mb-3">
            Platforms
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            One engine, every platform
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-3 gap-6 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          {PLATFORMS.map((p) => {
            const icon = p.icon;
            return (
              <div
                key={p.name}
                className="relative group p-8 rounded-2xl border border-surface-800/50 bg-surface-900/30 text-center hover:border-surface-700 hover:bg-surface-850/50 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-surface-800 flex items-center justify-center mb-5 group-hover:bg-surface-700 transition-colors">
                  <img alt="Icon" src={icon} className={`w-${p.size} h-${p.size} text-surface-300`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
