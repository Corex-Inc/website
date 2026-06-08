/** biome-ignore-all lint/suspicious/noArrayIndexKey:- */
/** biome-ignore-all lint/suspicious/noExplicitAny:- */
import { Menu, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '@/shared/lib/api.ts';
import { MetaDetail } from './MetaDetail';
import { MetaSidebar } from './MetaSidebar';
import type { MetaFilter, MetaItem } from './types.ts';

const DEFAULT_ADDON = 'Corex';
const SEARCH_DEBOUNCE_MS = 300;
const ITEMS_PER_PAGE = 20;

export function MetaPage() {
  const [addons, setAddons] = useState<string[]>([]);
  const [selectedAddon, setSelectedAddon] = useState(DEFAULT_ADDON);
  const [activeFilter, setActiveFilter] = useState<MetaFilter | null>(null);
  const [objectFilter, setObjectFilter] = useState<string | null>(null);

  const [items, setItems] = useState<MetaItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MetaItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeItemName, setActiveItemName] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsAbortController = useRef<AbortController | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [dragY, setDragY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartY = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    apiClient.get('/api/v1/meta/addons')
      .then((res) => setAddons(res.data.addons ?? []))
      .catch(() => setAddons([]));
  }, []);

  useEffect(() => {
    setLoadingItems(true);
    setSearchQuery('');
    setSearchResults(null);

    if (itemsAbortController.current) {
      itemsAbortController.current.abort();
    }
    const controller = new AbortController();
    itemsAbortController.current = controller;

    const url = `/api/v1/meta/all/${selectedAddon}${activeFilter ? `?filter=${activeFilter}` : ''}`;
    
    apiClient.get(url, { signal: controller.signal })
      .then((res) => {
        const data = res.data;
        setItems(Array.isArray(data) ? data : (data.results ?? data.items ?? []));
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingItems(false);
      });

    return () => controller.abort();
  }, [selectedAddon, activeFilter]);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setVisibleCount(ITEMS_PER_PAGE);
    
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (searchAbortController.current) searchAbortController.current.abort();

    if (!q.trim()) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    searchTimer.current = setTimeout(() => {
      const controller = new AbortController();
      searchAbortController.current = controller;

      const url = `/api/v1/meta/search/${selectedAddon}?query=${encodeURIComponent(q)}${activeFilter ? `&filter=${activeFilter}` : ''}`;
      
      apiClient.get(url, { signal: controller.signal })
        .then((res) => setSearchResults(res.data.results ?? []))
        .catch((err) => {
          if (err.name !== 'CanceledError' && err.message !== 'canceled') setSearchResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearchLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);
  }, [selectedAddon, activeFilter]);

  const baseItems = searchResults ?? items;
  
  const displayItems = useMemo(() => {
    if (!objectFilter) return baseItems;
    return baseItems.filter(item => 'object' in item && (item as any).object === objectFilter);
  }, [baseItems, objectFilter]);

  const availableObjects = useMemo(() => {
    if (activeFilter !== 'tag' && activeFilter !== 'mechanism') return [];
    const objs = new Set<string>();
    baseItems.forEach(item => {
      if ('object' in item && (item as any).object) {
        objs.add((item as any).object as string);
      }
    });
    return Array.from(objs).sort();
  }, [baseItems, activeFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < displayItems.length) {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [displayItems.length, visibleCount]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDragY(0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileSidebarOpen]);

  const handleTouchStartHandle = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    setIsDraggingSheet(true);
  };

  const handleTouchMoveHandle = (e: React.TouchEvent) => {
    if (!isDraggingSheet) return;
    const y = e.touches[0].clientY;
    const diff = y - dragStartY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEndHandle = () => {
    setIsDraggingSheet(false);
    if (dragY > 100) {
      setIsMobileSidebarOpen(false);
    }
    setDragY(0);
  };

  const handleFilterChange = (filter: MetaFilter | null) => {
    setActiveFilter(filter);
    setObjectFilter(null);
    setVisibleCount(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddonChange = (addon: string) => {
    setSelectedAddon(addon);
    setActiveFilter(null);
    setObjectFilter(null);
    setVisibleCount(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (item: MetaItem) => {
    const idKey = `${item.type}-${item.name}`;
    setActiveItemName(idKey);
    
    const idx = displayItems.findIndex(i => i.name === item.name && i.type === item.type);
    if (idx !== -1) {
      if (idx >= visibleCount) {
        setVisibleCount(idx + 5);
      }
      setTimeout(() => {
        const safeId = `meta-${item.type}-${item.name.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        document.getElementById(safeId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative">

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-xl border-t border-white/[0.05] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search details..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          type="button"
          className="w-[42px] h-[42px] flex shrink-0 items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl text-white/70 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex px-4 md:px-8 gap-6 max-w-[1600px] w-full mx-auto relative pb-6">
        
        <button
          type="button"
          className={`fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        <div 
          className={`
            fixed inset-x-0 bottom-0 z-50 h-[85vh] w-full md:w-auto md:max-w-none md:shrink-0 md:sticky md:top-[110px] md:h-[calc(100vh-134px)] md:z-10
            transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${isMobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
            md:translate-y-0 md:transition-none md:shadow-none
          `}
          style={isMobile ? {
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: isDraggingSheet ? 'none' : undefined 
          } : undefined}
        >
          <MetaSidebar
            items={displayItems}
            activeItemName={activeItemName}
            onSelectItem={handleSelectItem}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            addons={addons}
            selectedAddon={selectedAddon}
            onAddonChange={handleAddonChange}
            loading={loadingItems || searchLoading}
            availableObjects={availableObjects}
            objectFilter={objectFilter}
            onObjectFilterChange={setObjectFilter}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onTouchStartHandle={handleTouchStartHandle}
            onTouchMoveHandle={handleTouchMoveHandle}
            onTouchEndHandle={handleTouchEndHandle}
          />
        </div>

        <main className="flex-1 pt-[110px] pb-28 md:pb-32 min-w-0">
          <div className="flex flex-col gap-6">
            {(loadingItems || searchLoading) && displayItems.length === 0 ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              </div>
            ) : displayItems.length === 0 ? (
              <p className="text-center text-sm text-white/30 py-20">No matching details found.</p>
            ) : (
              displayItems.slice(0, visibleCount).map((item, index) => (
                <MetaDetail 
                  key={`${item.type}-${item.name}-${index}`} 
                  item={item} 
                  selectedAddon={selectedAddon} 
                />
              ))
            )}
            
            {visibleCount < displayItems.length && (
              <div ref={loaderRef} className="h-10 flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-white/10 border-t-[#3b82f6] rounded-full animate-spin" />
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}