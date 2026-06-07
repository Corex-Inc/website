import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { Header } from '@/components/shared/Header';
import { MetaSidebar } from './MetaSidebar';
import { MetaDetail } from './MetaDetail';
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
  
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsAbortController = useRef<AbortController | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const feedContainerRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

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

  const handleFilterChange = (filter: MetaFilter | null) => {
    setActiveFilter(filter);
    setObjectFilter(null);
    setVisibleCount(ITEMS_PER_PAGE);
    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddonChange = (addon: string) => {
    setSelectedAddon(addon);
    setActiveFilter(null);
    setObjectFilter(null);
    setVisibleCount(ITEMS_PER_PAGE);
    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      <div className="flex-1 flex px-4 md:px-8 gap-6 max-w-[1600px] w-full mx-auto relative pb-6">
        
        <div className="sticky top-[110px] h-[calc(100vh-134px)] flex shrink-0 z-10">
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
          />
        </div>

        <main className="flex-1 pt-[110px] min-w-0">
          <div className="flex flex-col gap-6 pb-32">
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