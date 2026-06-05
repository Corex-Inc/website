import { ChevronRight } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export default function SyntaxSection() {
  return (
    <section id="syntax" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-surface-500 text-sm font-medium uppercase tracking-widest mb-3">
            Syntax
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Write less, do more</h2>
          <p className="mt-4 text-surface-400 max-w-xl mx-auto text-sm sm:text-base">
            Commands start with{' '}
            <code className="font-mono text-surface-300 bg-surface-800 px-1.5 py-0.5 rounded text-xs sm:text-sm">-</code>
            , tags live inside{' '}
            <code className="font-mono text-surface-300 bg-surface-800 px-1.5 py-0.5 rounded text-xs sm:text-sm">&lt;&gt;</code>
            . No boilerplate, no ceremony.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="feature-card">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <ChevronRight className="w-4 h-4 text-surface-500 flex-shrink-0" />
                Command syntax
              </h4>
              <p className="text-surface-400 text-sm leading-relaxed">
                Every command starts with <code className="font-mono text-surface-300">-</code>
                , followed by the command name and arguments. Linear args passed as plain values,
                prefix args as key:value pairs.
              </p>
            </div>

            <div className="feature-card">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <ChevronRight className="w-4 h-4 text-surface-500 flex-shrink-0" />
                Tag syntax
              </h4>
              <p className="text-surface-400 text-sm leading-relaxed">
                A tag is a chain inside <code className="font-mono text-surface-300">&lt;&gt;</code>
                . Read left to right: each part receives the result of the previous one and returns
                a new value.
              </p>
            </div>

            <div className="feature-card">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <ChevronRight className="w-4 h-4 text-surface-500 flex-shrink-0" />
                One .jar lifecycle
              </h4>
              <p className="text-surface-400 text-sm leading-relaxed">
                One file runs on Paper, Folia and Velocity. On load, the server detects the
                platform and reads the right config.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <CodeBlock />
          </div>
        </div>
      </div>
    </section>
  );
}
