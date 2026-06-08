import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

const SECTIONS = [
  { path: 'terms', title: 'Terms of Service', icon: FileText },
  { path: 'privacy', title: 'Privacy Policy', icon: Shield },
] as const;

function getCurrentSection(pathname: string): string {
  const match = pathname.match(/^\/documents\/([^/]+)/);
  return match ? match[1] : 'terms';
}

export default function DocumentsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSection = getCurrentSection(location.pathname);
  const current = SECTIONS.find(s => s.path === currentSection) || SECTIONS[0];

  useEffect(() => {
    if (!/^\/documents\/[^/]+$/.test(location.pathname)) {
      navigate('/documents/terms', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-950 text-white flex flex-col font-sans pt-32 pb-12">
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative px-4 lg:px-8">

          <aside
            className={`
              fixed z-50 bg-[#0f0f0f] flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden
              top-0 left-0 h-full w-[85vw] max-w-[320px] rounded-r-2xl border-r border-white/5
              lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] lg:w-[280px] lg:max-w-none lg:rounded-xl lg:border lg:border-white/5 lg:translate-x-0 lg:z-10
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <span className="font-unbounded font-bold text-white uppercase tracking-wider text-sm">Legal</span>
              <button
                className="text-gray-400 hover:text-white p-1 -mr-1 transition-colors outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 lg:p-4">
              <div className="mb-4 px-3 pt-2">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Legal Documents</h2>
              </div>
              <ul className="space-y-1">
                {SECTIONS.map(s => {
                  const Icon = s.icon;
                  const isActive = currentSection === s.path;
                  return (
                    <li key={s.path}>
                      <Link
                        to={`/documents/${s.path}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'opacity-100' : 'opacity-50'} />
                        {s.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 px-3">
                <div className="h-px bg-white/5 mb-4" />
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Last updated: June 7, 2026
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 py-0 px-6 lg:px-12 xl:px-20">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 uppercase tracking-wider font-bold">
                <img src="/favicon.svg" alt="Corex" className="w-4 h-4 opacity-50" />
                Legal Documents
              </div>

              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl text-white flex items-center gap-4 font-unbounded font-bold">
                  {current.title}
                </h1>
              </div>

              <div className="prose prose-invert max-w-none prose-headings:font-unbounded prose-headings:tracking-tight prose-p:text-gray-400 prose-p:leading-relaxed prose-a:text-white prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-200 prose-li:text-gray-400 prose-li:leading-relaxed [&_h1]:scroll-mt-64 [&_h2]:scroll-mt-64 [&_h3]:scroll-mt-64">
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
