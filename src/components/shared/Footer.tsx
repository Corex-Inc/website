import { Terminal, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-800/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center">
              <img src='/favicon.svg' className="w-7 h-7 text-surface-950" />
            </div>
            <span className="text-sm font-semibold text-surface-400">Corex</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-surface-500">
            <a href="#" className="hover:text-surface-300 transition-colors">Documentation</a>
            <a href="#" className="hover:text-surface-300 transition-colors">Meta Docs</a>
            <a href="https://modrinth.com/plugin/corex.cx" className="hover:text-surface-300 transition-colors">Download</a>
            <a href="https://github.com/Corex-Inc/Corex" className="hover:text-surface-300 transition-colors flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>

          <p className="text-xs text-surface-600">Built for Paper, Folia & Velocity</p>
        </div>
      </div>
    </footer>
  );
}
