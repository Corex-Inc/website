import { BookOpen, Download, ExternalLink, FileCode } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-900/30 to-surface-950" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-surface-400 mb-10 max-w-lg mx-auto">
          Download Corex, read the docs, or explore the meta documentation to understand every tag
          and command.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://modrinth.com/plugin/corex.cx" className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </a>
          <a href="/documentation" className="btn-secondary flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Documentation
          </a>
          <a href="/meta" className="btn-secondary flex items-center gap-2">
            <FileCode className="w-4 h-4" /> Meta Docs
            <ExternalLink className="w-3 h-3 text-surface-500" />
          </a>
        </div>
      </div>
    </section>
  );
}
