import { useEffect, useState } from 'react';
import { CODE_EXAMPLES } from '../../data/constants';
import { highlightCode } from '../../lib/highlighter';

function HighlightedCode({ code }: { code: string }) {
  const [html, setHtml] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    highlightCode(code).then((result) => {
      if (!cancelled) {
        setHtml(result);
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [code]);

  const lines = code.split('\n');

  if (!ready) {
    return (
      <pre className="text-xs md:text-sm leading-6 font-mono text-surface-400 p-4 md:p-5 overflow-auto flex-1 m-0 bg-transparent">
        {lines.map((line, i) => (
          <div key={line} className="flex">
            <span className="text-surface-600 select-none w-8 md:w-10 text-right pr-3 md:pr-4 flex-shrink-0">{i + 1}</span>
            <span className="flex-1 break-words">{line || '\u00A0'}</span>
          </div>
        ))}
      </pre>
    );
  }

  return (
    <div className="text-xs md:text-sm leading-6 font-mono overflow-auto flex-1">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((_, i) => (
            <tr key={_} className="hover:bg-surface-900/30">
              <td className="text-surface-600 select-none w-8 md:w-10 text-right pr-3 md:pr-4 flex-shrink-0 py-0 px-0 align-top bg-surface-900/20">{i + 1}</td>
              <td className="py-0 px-0 align-top">
                <pre
                  className="m-0 bg-transparent p-0 overflow-visible"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml:-
                  dangerouslySetInnerHTML={{
                    __html: html.split('\n')[i] || '',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-surface-900/50 to-surface-950/50 rounded-lg border border-surface-800/50 overflow-hidden w-full">
      <div className="flex border-b border-surface-800 bg-surface-900/80 flex-shrink-0 overflow-x-auto">
        {CODE_EXAMPLES.map((ex, i) => (
          <button
            key={ex.label}
            onClick={() => setActiveTab(i)}
            type="button"
            className={`px-2 md:px-4 py-2 md:py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === i
                ? 'text-white border-b-2 border-white bg-surface-850'
                : 'text-surface-500 hover:text-surface-300 border-b-2 border-white/0 bg-surface-850/0'
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto min-h-0 w-full">
        <HighlightedCode code={CODE_EXAMPLES[activeTab].code} key={activeTab} />
      </div>
    </div>
  );
}

