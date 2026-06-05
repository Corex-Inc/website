import React, { ReactNode } from 'react';
import { pagesConfigs } from 'virtual:docs-registry';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface DocPage {
  path: string;
  title: string;
  emoji?: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  priority: number;
  category: string;
  toc?: TocItem[];
  parent?: string;
}

export interface CategoryMeta {
  name: string;
  priority: number;
  emoji?: string;
}

const lazyModules = import.meta.glob('./pages/**/*.tsx');
const metaModules = import.meta.glob('./pages/**/_category.ts', { eager: true });

class DocsRegistry {
  private pages: Array<DocPage> = [];
  private categoriesMeta: Record<string, CategoryMeta> = {};

  constructor() {
    Object.entries(metaModules).forEach(([filePath, mod]: [string, any]) => {
      const folderName = filePath.split('/')[2];
      const meta = mod.default;
      if (meta?.name) this.categoriesMeta[folderName] = meta;
    });

    this.pages = pagesConfigs
      .map((entry: any) => {
        const lazyFactory = lazyModules[entry.moduleId];
        if (!lazyFactory) {
          console.warn(`[DocsRegistry] Module not found: ${entry.moduleId}`);
          return null;
        }

        const folderName = entry.moduleId.split('/')[2];
        const categoryData = this.categoriesMeta[folderName];

        const LazyComponent = React.lazy(
          lazyFactory as () => Promise<{ default: React.ComponentType<any> }>
        );

        return {
          ...entry,
          category: categoryData ? categoryData.name : folderName,
          component: LazyComponent,
        };
      })
      .filter((page: any): page is DocPage => page !== null)
      .sort((a: DocPage, b: DocPage) => a.priority - b.priority);
  }

  getPages() { return this.pages; }
  getPage(path: string | undefined) { return this.pages.find(p => p.path === path); }

  getCategoryPriority(categoryName: string): number {
    const foundMeta = Object.values(this.categoriesMeta).find(m => m.name === categoryName);
    return foundMeta ? foundMeta.priority : 999;
  }

  getCategoryEmoji(categoryName: string): ReactNode {
    const foundMeta = Object.values(this.categoriesMeta).find(
      m => m.name.trim().toLocaleUpperCase() === categoryName.trim().toLocaleUpperCase()
    );
    return foundMeta?.emoji || '';
  }
}

export const docsModule = new DocsRegistry();