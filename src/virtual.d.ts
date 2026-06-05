declare module 'virtual:docs-registry' {
  import type { TocItem } from '@/docs/registry';

  export interface PageConfig {
    moduleId: string;
    path: string;
    title: string;
    emoji?: string;
    priority: number;
    toc?: TocItem[];
    parent?: string;
  }

  export const pagesConfigs: PageConfig[];
}