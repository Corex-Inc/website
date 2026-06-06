import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] pt-20 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1 flex flex-col">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all">
                <img src='/shared/logos/CorexInc.svg' className="w-10 h-10 rounded-xl" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-unbounded">Corex Inc.</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              High-performance plugin framework for modern Paper servers.
            </p>
          </div>

          <FooterColumn title="Corex">
            <FooterLink href="/documentation">Documentation</FooterLink>
            <FooterLink href="/meta">Meta Docs</FooterLink>
            <FooterLink external href="https://modrinth.com/plugin/corex.cx">Download</FooterLink>
            <FooterLink external href="/@@@">VSCode Extension</FooterLink>
          </FooterColumn>

          <FooterColumn title="Community">
            <FooterLink external href="https://dsc.gg/corexinc">Discord</FooterLink>
            <FooterLink external href="https://t.me/corexinc">Telegram</FooterLink>
            <FooterLink external href="https://modrinth.com/plugin/corex.cx">Modrinth</FooterLink>
            <FooterLink external href="https://github.com/Corex-Inc/Corex/issues">Issues</FooterLink>
          </FooterColumn>

          <FooterColumn title="Services">
            <FooterLink href="/hub/scripts">Scripts</FooterLink>
            <FooterLink href="/hub/addons">Addons</FooterLink>
            <FooterLink href="/hub/pastebin">Pastebin</FooterLink>
            <FooterLink href="/hub/migrator">Migrator</FooterLink>
          </FooterColumn>
        </div>

        <div className="mb-6 flex items-center gap-1 text-sm text-gray-400">
          <span>Corex is</span>
          <a
            href="https://github.com/Corex-Inc/Corex"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-0.5 font-medium text-white hover:text-gray-300 transition-colors"
          >
            open source.
            <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs pb-32 md:pb-40">
        <div>
          <p>© {new Date().getFullYear()} Corex Inc. All Rights Reserved.</p>
          <p className='font-bold py-3'>Not an official Minecraft service. Not approved by or associated with Mojang or Microsoft.</p>
        </div>
          <div className="flex items-center gap-4">
            <Link to="/documents/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <span className="text-gray-700">•</span>
            <Link to="/documents/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-5%] left-0 right-0 flex justify-center pointer-events-none select-none">
        <h1 className="font-unbounded text-[23vw] leading-[0.8] font-black text-transparent bg-clip-text bg-gradient-to-t from-white/50 to-white/0 tracking-tighter mix-blend-overlay">
          COREX
        </h1>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-4">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300"
        target={external ? '_blank' : '_self'}
      >
        <span>{children}</span>
        {external && (
          <ArrowUpRight
            size={14}
            className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
          />
        )}
      </a>
    </li>
  );
}