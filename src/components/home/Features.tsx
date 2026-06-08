import { FEATURES } from '@/shared/constants/constants';
import { FeatureCard } from './FeatureCard';

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-surface-500 text-sm font-medium uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Built for performance, designed for simplicity
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
