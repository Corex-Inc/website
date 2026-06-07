import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import darkPlus from '../grammars/2026-dark.json';
import corexGrammar from '../grammars/corex.tmLanguage.json';

import langJava from 'shiki/langs/java.mjs';
import langXML from 'shiki/langs/xml.mjs';

let highlighterInstance: HighlighterCore | null = null;
let initPromise: Promise<HighlighterCore> | null = null;

const COREX_LANG = {
  ...corexGrammar,
  id: 'corex',
  aliases: ['corex'],
};

async function initHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance) return highlighterInstance;
  if (initPromise) return initPromise;

  initPromise = createHighlighterCore({
    themes: [darkPlus as any],
    langs: [COREX_LANG as any,
            langJava,
            langXML,
           ],
    engine: createOnigurumaEngine(() => fetch('/onig.wasm').then(r => r.arrayBuffer())),
  }).then((h) => {
    highlighterInstance = h;
    return h;
  });

  return initPromise;
}

export async function highlightCode(code: string, lang = 'corex'): Promise<string> {
  const highlighter = await initHighlighter();
  const themeName = (darkPlus as any).name || '2026-dark';

  return highlighter.codeToHtml(code, {
    lang,
    theme: themeName,
  });
}