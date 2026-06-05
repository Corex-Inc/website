import { useEffect, useState, useRef } from 'react';
import { LogIn, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import Button from './Button';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        open &&
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(target) &&
        !avatarRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          scrolled ? 'pt-4 px-8' : 'pt-6 px-4'
        }`}
      >
        <div
          className={`
            mx-auto backdrop-blur-xl
            bg-surface-950/80 supports-[backdrop-filter]:bg-surface-950/60
            border border-white/5
            rounded-full
            shadow-2xl shadow-black/50
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            flex items-center justify-between
            ${scrolled ? 'max-w-[1200px] py-3 px-6' : 'max-w-7xl py-3 px-8'}
          `}
        >
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <div className={`
              relative flex items-center justify-center shrink-0
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} 
            `}>
              <div className={`
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                bg-white rounded-full blur-xl
                transition-all duration-500 ease-out
                opacity-0 group-hover:opacity-20 group-hover:scale-150
                ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}
              `} />
              <img 
                className={`
                  relative z-10 object-contain
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  group-hover:scale-110
                  ${scrolled ? 'w-[4rem] h-[4rem]' : 'w-[5rem] h-[5rem]'} 
                `}
                src="/shared/logo_no_bg.webp" 
                alt="Logo" 
              />
            </div>
            <h1 className={`
              font-bold text-white font-unbounded tracking-tight
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              group-hover:text-gray-300
              ${scrolled ? 'text-xl' : 'text-2xl'}
            `}>
              Corex
            </h1>
          </Link>

          <nav className="flex items-center gap-4 relative">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  ref={avatarRef}
                  onClick={() => setOpen(!open)}
                  className="group flex items-center gap-3 focus:outline-none"
                >
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                       <span className={`font-medium text-white transition-all duration-500 flex items-center gap-1 ${scrolled ? 'text-sm' : 'text-base'}`}>
                         {user.username}
                       </span>
                       <ChevronDown className={`text-surface-400 transition-transform duration-300 w-4 h-4 ${open ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <div className={`
                    relative rounded-lg overflow-hidden 
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} 
                  `}>
                       <img src={`https://avatars.spworlds.ru/face/${user.avatar || user.username}`} alt="Avatar" className="w-full h-full select-none" draggable='false' />
                  </div>
                </button>

                <div
                  ref={dropdownRef}
                  className={`
                    absolute right-0 mt-3 w-64 rounded-2xl border border-white/5 supports-[backdrop-filter]:bg-surface-950/90
                    shadow-2xl shadow-black ring-1 ring-white/5 overflow-hidden 
                    transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right z-50
                    ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}
                  `}
                >
                  <div className="p-2">
                    <Link 
                      to="/settings"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white-400 hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button size="small" variant='primary' className='!rounded-full' onClick={() => setIsLoginModalOpen(true)}>
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
