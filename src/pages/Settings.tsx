import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Link2, type LucideIcon, User } from 'lucide-react';
import nprogress from 'nprogress';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { CorexLoader } from '@/components/shared/loading/corex';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';
import { authService } from '../lib/authService';

const ProfileSettings = lazy(() => import( '../components/settings/ProfileSettings'));
const AboutSettings = lazy(() => import( '../components/settings/AboutSettings'));
const ConnectionsSettings = lazy(() => import( '../components/settings/ConnectionsSettings'));

type SectionId = 'profile' | 'connections' | 'account';

const SIDEBAR_ITEMS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'connections', label: 'Connected Accounts', icon: Link2 },
];

const SHAKE_STYLE = `
@keyframes settings-shake {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(-7px) rotate(-0.4deg); }
  30%  { transform: translateX(7px)  rotate(0.4deg); }
  45%  { transform: translateX(-5px) rotate(-0.3deg); }
  60%  { transform: translateX(5px)  rotate(0.3deg); }
  75%  { transform: translateX(-3px); }
  90%  { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
.settings-shake {
  animation: settings-shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
}
`;

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  // biome-ignore lint/suspicious/noExplicitAny: Any type of response
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  const dirtyMapRef = useRef<Record<string, { dirty: boolean; save: () => Promise<void> }>>({});
  const [hasDirty, setHasDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [shaking, setShaking] = useState(false);
  const [barDanger, setBarDanger] = useState(false);

  useEffect(() => {
    const id = 'settings-shake-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = SHAKE_STYLE;
      document.head.appendChild(style);
    }
  }, []);

  const triggerDangerFeedback = useCallback(() => {
    setBarDanger(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 460);
    setTimeout(() => setBarDanger(false), 460);
  }, []);

  const handleSectionChange = useCallback((id: SectionId) => {
    if (hasDirty) {
      triggerDangerFeedback();
      return;
    }
    setActiveSection(id);
  }, [hasDirty, triggerDangerFeedback]);

  const handleDirty = useCallback(
    (key: string, dirty: boolean, save: () => Promise<void>) => {
      dirtyMapRef.current[key] = { dirty, save };
      const anyDirty = Object.values(dirtyMapRef.current).some((v) => v.dirty);
      setHasDirty(anyDirty);
    },
    []
  );

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const dirtyEntries = Object.values(dirtyMapRef.current).filter((v) => v.dirty);
      await Promise.all(dirtyEntries.map((v) => v.save()));
      Object.keys(dirtyMapRef.current).forEach((k) => {
        dirtyMapRef.current[k].dirty = false;
      });
      setHasDirty(false);
      setBarDanger(false);
      setSaveSuccess(true);
      handleRefresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const [resetKey, setResetKey] = useState(0);

  const handleResetAll = () => {
    setResetKey((k) => k + 1);
    dirtyMapRef.current = {};
    setHasDirty(false);
    setBarDanger(false);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const res = await authService.getSettings();
          setSettings(res?.settings || null);
        } catch (error) {
          console.error('Failed to fetch settings', error);
        }
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const handleRefresh = useCallback(async () => {
    nprogress.start();
    try {
      await refreshProfile();
      const res = await authService.getSettings();
      setSettings(res?.settings || null);
    } catch (error) {
      console.error('Failed to refresh settings', error);
    } finally {
      nprogress.done();
    }
  }, [refreshProfile]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'auth:link-complete') return;
      await handleRefresh();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleRefresh]);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-950 text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-surface-400">Please log in to view settings.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div style={{ overflow: 'hidden' }} className='py-8'>
        <div
          className={`min-h-screen bg-surface-950 text-white relative${shaking ? ' settings-shake' : ''}`}
        >
          <main className="pt-24 pb-36 px-4 md:px-8 max-w-6xl mx-auto min-h-[calc(100vh-200px)]">
            <div className="mb-6 md:mb-8 flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold text-white">Settings</h1>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <CorexLoader />
              </div>
            ) : (
              <>
                <div className="flex md:hidden mb-4 overflow-x-auto no-scrollbar">
                  {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSectionChange(id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                        activeSection === id
                          ? 'border-white text-white'
                          : 'border-transparent text-surface-400 hover:text-surface-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-6 items-start">
                  <aside className="hidden md:block w-52 flex-shrink-0 sticky top-28">
                    <nav className="space-y-0.5">
                      {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                        <motion.button
                          key={id}
                          onClick={() => handleSectionChange(id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                            activeSection === id
                              ? 'bg-white/10 text-white'
                              : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {label}
                        </motion.button>
                      ))}
                    </nav>
                  </aside>

                  <div className="flex-1 min-w-0" key={resetKey}>
                    {activeSection === 'profile' && (
                      <div className="space-y-6 md:space-y-8 bg-surface-900/20 border border-white/5 rounded-xl p-4 md:p-6">
                        <Suspense fallback={<CorexLoader />} >
                          <ProfileSettings
                            avatar={settings?.avatar}
                            username={settings?.username}
                            name={settings?.name}
                            onDirty={handleDirty}
                          />
                          <div className="border-t border-white/5 pt-5 md:pt-6">
                            <AboutSettings about={settings?.about} onDirty={handleDirty} />
                          </div>
                        </Suspense>
                      </div>
                    )}
                    {activeSection === 'connections' && (
                      <div className="bg-surface-900/20 border border-white/5 rounded-xl p-4 md:p-6">
                        <Suspense fallback={<CorexLoader/>} >
                          <ConnectionsSettings settings={settings} onRefresh={handleRefresh} />
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        <AnimatePresence>
          {(hasDirty || saveSuccess) && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-6 left-0 right-0 flex justify-center z-50"
            >
              <motion.div
                animate={{
                  backgroundColor: saveSuccess
                    ? 'rgb(6 78 59 / 0.97)'
                    : barDanger
                    ? 'rgb(127 29 29 / 0.97)'
                    : 'rgb(17 17 17 / 0.97)',
                  borderColor: saveSuccess
                    ? 'rgb(52 211 153 / 0.35)'
                    : barDanger
                    ? 'rgb(239 68 68 / 0.55)'
                    : 'rgb(255 255 255 / 0.15)',
                }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-3 px-4 md:px-5 py-3 border rounded-xl shadow-2xl shadow-black/50 backdrop-blur-sm w-[calc(100vw-2rem)] max-w-2xl"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm md:text-base text-emerald-400 font-medium">Changes saved!</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={barDanger ? { rotate: [0, -15, 15, -10, 10, 0] } : { rotate: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex-shrink-0"
                    >
                      <AlertTriangle
                        className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-200 ${
                          barDanger ? 'text-red-400' : 'text-amber-400'
                        }`}
                      />
                    </motion.div>
                    <span
                      className={`text-xs md:text-sm font-mono transition-colors duration-200 flex-1 min-w-0 ${
                        barDanger ? 'text-red-300' : 'text-surface-300'
                      }`}
                    >
                      Unsaved changes!
                    </span>
                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleResetAll}
                        disabled={saving}
                        className={`px-3 py-1.5 text-xs md:text-sm font-semibold border font-unbounded rounded-lg transition-colors whitespace-nowrap ${
                          barDanger
                            ? 'text-red-300 border-red-500/40 hover:bg-red-500/10'
                            : 'text-surface-300 hover:text-white border-white/15 hover:bg-white/5'
                        }`}
                      >
                        Reset
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveAll}
                        disabled={saving}
                        className={`px-3 py-1.5 text-xs md:text-sm font-semibold font-unbounded rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap ${
                          barDanger
                            ? 'text-white bg-red-500 hover:bg-red-400'
                            : 'text-black bg-white hover:bg-gray-300'
                        }`}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}