/** biome-ignore-all lint/suspicious/noArrayIndexKey:- */
import { Check, ChevronDown, Filter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { MetaFilter, MetaItem } from './types.ts';

const FILTER_OPTIONS: { label: string; value: MetaFilter }[] = [
  { label: 'Commands', value: 'command' },
  { label: 'Tags', value: 'tag' },
  { label: 'Objects', value: 'object' },
  { label: 'Formatters', value: 'formatter' },
  { label: 'Mechanisms', value: 'mechanism' },
  { label: 'Events', value: 'event' },
];

interface MetaSidebarProps {
  items: MetaItem[];
  activeItemName: string | null;
  onSelectItem: (item: MetaItem) => void;
  activeFilter: MetaFilter | null;
  onFilterChange: (filter: MetaFilter | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  addons: string[];
  selectedAddon: string;
  onAddonChange: (addon: string) => void;
  loading: boolean;
  availableObjects: string[];
  objectFilter: string | null;
  onObjectFilterChange: (obj: string | null) => void;
  onCloseMobile?: () => void;
  
  onTouchStartHandle?: (e: React.TouchEvent) => void;
  onTouchMoveHandle?: (e: React.TouchEvent) => void;
  onTouchEndHandle?: () => void;
}

export function MetaSidebar({
  items,
  activeItemName,
  onSelectItem,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  addons,
  selectedAddon,
  onAddonChange,
  loading,
  availableObjects,
  objectFilter,
  onObjectFilterChange,
  onCloseMobile,
  onTouchStartHandle,
  onTouchMoveHandle,
  onTouchEndHandle
}: MetaSidebarProps) {
  const [addonOpen, setAddonOpen] = useState(false);
  const [objectOpen, setObjectOpen] = useState(false);
  
  const addonRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [topHeight, setTopHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('meta-sidebar-top-height');
      return saved ? parseInt(saved, 10) : 350;
    }
    return 350;
  });

  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(max-width: 768px)');
      setIsMobile(mql.matches);
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    const newHeight = e.clientY - rect.top;
    
    const minHeight = 150;
    const maxHeight = rect.height - 100;
    const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    
    setTopHeight(clampedHeight);
    localStorage.setItem('meta-sidebar-top-height', clampedHeight.toString());
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addonRef.current && !addonRef.current.contains(e.target as Node)) {
        setAddonOpen(false);
      }
      if (objectRef.current && !objectRef.current.contains(e.target as Node)) {
        setObjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [visibleSidebarCount, setVisibleSidebarCount] = useState(50);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleSidebarCount(50);
    if (listRef.current) listRef.current.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleSidebarCount < items.length) {
        setVisibleSidebarCount((prev) => prev + 50);
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [items.length, visibleSidebarCount]);

  return (
    <aside ref={sidebarRef} className="flex flex-col h-full bg-[#141414] md:border border-white/[0.05] rounded-t-3xl md:rounded-3xl w-full md:w-[300px] shrink-0 md:shadow-2xl overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.7)]">
      
      <div 
        className="md:hidden flex items-center justify-center pt-4 pb-3 w-full shrink-0 touch-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStartHandle}
        onTouchMove={onTouchMoveHandle}
        onTouchEnd={onTouchEndHandle}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full" />
      </div>

      <div 
        style={{ 
          height: isMobile ? 'auto' : topHeight,
          maxHeight: isMobile ? '50%' : 'calc(100% - 100px)',
        }}
        className="flex flex-col overflow-y-auto shrink-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10"
      >
        <div className="hidden md:block p-4 border-b border-white/[0.05] shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search details..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-white/[0.05] shrink-0" ref={addonRef}>
          <div className="relative">
            <button
              onClick={() => setAddonOpen((v) => !v)}
              type="button"
              className="w-full flex items-center justify-between bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] rounded-xl px-3 py-2 text-sm text-white/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-white/50">⚙️</span>
                <span className="font-medium">{selectedAddon}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${addonOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {addonOpen && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl overflow-hidden z-30 shadow-2xl flex flex-col max-h-60 p-1">
                <div className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <button
                    onClick={() => { onAddonChange('Corex'); setAddonOpen(false); }}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${selectedAddon === 'Corex' ? 'text-white bg-white/10 font-medium' : 'text-white/60 hover:bg-white/[0.04]'}`}
                  >
                    Corex
                  </button>
                  {addons.filter((a) => a !== 'Corex').map((a, index) => (
                    <button
                      key={`${index}-${a}`}
                      onClick={() => { onAddonChange(a); setAddonOpen(false); }}
                      type="button"
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${selectedAddon === a ? 'text-white bg-white/10 font-medium' : 'text-white/60 hover:bg-white/[0.04]'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-b border-white/[0.05] shrink-0">
          {FILTER_OPTIONS.map((f, index) => (
            <button
              key={`${index}-${f.value}`}
              onClick={() => onFilterChange(activeFilter === f.value ? null : f.value)}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors group"
            >
              <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-200 ${
                activeFilter === f.value
                  ? 'bg-white border-white text-black'
                  : 'border-white/20 group-hover:border-white/40'
              }`}>
                {activeFilter === f.value && <Check className="w-3 h-3" />}
              </div>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {availableObjects.length > 0 && (
          <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.01] shrink-0" ref={objectRef}>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40 mb-2 font-semibold">
              <Filter className="w-3 h-3" /> Object Type
            </div>
            <div className="relative">
              <button
                onClick={() => setObjectOpen((v) => !v)}
                type="button"
                className={`w-full flex items-center justify-between border rounded-xl px-3 py-2 text-sm transition-colors ${
                  objectFilter 
                    ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' 
                    : 'bg-white/[0.03] border-white/5 text-white/80 hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate">{objectFilter || 'All Objects'}</span>
                <ChevronDown className={`shrink-0 w-3.5 h-3.5 transition-transform duration-200 ${
                  objectFilter ? 'text-white/70' : 'text-white/30'
                } ${objectOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {objectOpen && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl overflow-hidden z-20 shadow-2xl flex flex-col max-h-60 p-1">
                  <div className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <button
                      onClick={() => { onObjectFilterChange(null); setObjectOpen(false); }}
                      type="button"
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${
                        !objectFilter 
                          ? 'text-white bg-white/[0.06] font-medium' 
                          : 'text-white/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      All Objects
                    </button>
                    {availableObjects.map((obj, index) => (
                      <button
                        key={`${index}-${obj}`}
                        onClick={() => { onObjectFilterChange(obj); setObjectOpen(false); }}
                        type="button"
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${
                          objectFilter === obj 
                            ? 'text-white bg-white/10 font-medium' 
                            : 'text-white/60 hover:bg-white/[0.04]'
                        }`}
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isMobile && (
        <section 
          onMouseDown={handleMouseDown}
          role="region"
          className="h-2 cursor-ns-resize shrink-0 z-20 flex items-center justify-center group hover:bg-white/[0.05] transition-colors"
        >
          <div className="w-8 h-1 bg-white/10 group-hover:bg-white/30 rounded-full transition-colors" />
        </section>
      )}

      <div ref={listRef} className="flex-1 overflow-y-auto py-2 pb-6 md:pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="px-4 pb-3 pt-1 text-[10px] font-mono text-white/30 text-right">
          {items.length} matched
        </div>
        
        {loading ? (
          <div className="flex flex-col gap-1 px-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl bg-white/[0.03] animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/25">No results</p>
        ) : (
          <div className="px-2 flex flex-col gap-0.5">
            {items.slice(0, visibleSidebarCount).map((item, index) => {
              const isSelected = activeItemName === `${item.type}-${item.name}`;
              return (
                <button
                  key={`${item.type}-${item.name}-${index}`}
                  onClick={() => {
                    onSelectItem(item);
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  type="button"
                  className={`
                    w-full text-left flex items-center gap-2 px-3 py-2 text-sm transition-all duration-150 rounded-xl group
                    ${isSelected
                      ? 'bg-white/10 text-white font-medium shadow-sm'
                      : 'text-white/60 hover:bg-white/[0.03] hover:text-white/90'
                    }
                  `}
                >
                  <span className="truncate font-mono text-[13px]">{item.name}</span>
                </button>
              )
            })}
            
            {visibleSidebarCount < items.length && (
              <div ref={loadMoreRef} className="h-10 shrink-0 flex items-center justify-center mt-2">
                <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export { FILTER_OPTIONS };