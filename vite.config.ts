import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import vm from 'vm';
import { glob } from 'glob';

function extractConfigObject(code: string): Record<string, any> | null {
  const marker = '.config = {';
  const start = code.indexOf(marker);
  if (start === -1) return null;

  const objStart = start + marker.length - 1;
  let depth = 0;
  let i = objStart;

  for (; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }

  const objStr = code.slice(objStart, i + 1);
  try {
    return vm.runInNewContext(`(${objStr})`);
  } catch {
    return null;
  }
}

function docsRegistryPlugin(): Plugin {
  const VIRTUAL_ID   = 'virtual:docs-registry';
  const RESOLVED_ID  = '\0' + VIRTUAL_ID;
  const PAGES_GLOB   = './src/docs/pages/**/*.tsx';

  let pageFiles: string[] = [];

  function buildVirtualModule() {
    pageFiles = glob.sync(PAGES_GLOB);

    const entries: any[] = [];
    for (const absPath of pageFiles) {
      const code     = fs.readFileSync(absPath, 'utf-8');
      const config   = extractConfigObject(code);
      if (!config) continue;

      const rel = path
        .relative(path.resolve('src/docs'), absPath)
        .replace(/\\/g, '/');

      entries.push({ ...config, moduleId: './' + rel });
    }

    return `export const pagesConfigs = ${JSON.stringify(entries, null, 2)};`;
  }

  return {
    name: 'docs-registry',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      return buildVirtualModule();
    },

    handleHotUpdate({ file, server }) {
      const isPage = pageFiles.includes(file);
      if (!isPage) return;

      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  plugins: [
    docsRegistryPlugin(),
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('lucide-react')) return 'vendor-ui';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
        },
      },
    },
  },
});