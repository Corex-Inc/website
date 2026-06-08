import { Check, ChevronDown, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { highlightCode } from '@/shared/lib/highlighter';

interface DocsCodeBlockProps {
  lang?: string;
  text: string;
  title?: string;
  filename?: string;
  collapseAt?: number;
}

export function DocsCodeBlock({
  lang = "corex",
  text,
  title,
  filename,
  collapseAt = 8,
}: DocsCodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const code = text.replace(/^\n/, "").replace(/\n$/, "");
  const lineCount = code.split("\n").length;
  const canCollapse = lineCount > collapseAt;

  useEffect(() => {
    let cancelled = false;
    highlightCode(code, lang)
      .then((result) => { if (!cancelled) setHtml(result); })
      .catch(() => { if (!cancelled) setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`); });
    return () => { cancelled = true; };
  }, [code, lang]);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const collapsedPx = collapseAt * 24 + 32;

  const leftLabel = !title && (filename ?? (lang ? lang.toUpperCase() : null));

  return (
    <div className="not-prose my-6 rounded-lg border border-white/[0.07] bg-[#0d0d0d] overflow-hidden shadow-lg">

      <div className="relative flex items-center px-4 py-2 border-b border-white/[0.06] bg-white/[0.02] min-h-[36px]">

        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
          {leftLabel && (
            <span className="ml-2 font-mono text-xs text-white/25 tracking-wide">
              {leftLabel}
            </span>
          )}
        </div>

        {title && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-24">
            <span className="font-mono text-xs text-white/40 tracking-wide truncate">
              {title}
            </span>
          </div>
        )}

        <div className="ml-auto shrink-0">
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy code"
            className="
              flex items-center gap-1.5 px-2.5 py-1 rounded
              text-xs font-mono
              border border-white/[0.06]
              transition-all duration-150 select-none
              text-white/30 hover:text-white/60 hover:border-white/20
            "
          >
            {copied ? (
              <>
                <Check />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: canCollapse && collapsed ? collapsedPx : contentHeight || 9999 }}
      >
        <div ref={contentRef}>
          {html ? (
            <div
              className="shiki-wrapper text-sm leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml:-
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="px-4 py-4 text-sm font-mono text-white/20 leading-relaxed">
              {code}
            </pre>
          )}
        </div>

        {canCollapse && collapsed && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0d0d0d)" }}
          />
        )}
      </div>

      {canCollapse && (
        <button
          onClick={() => setCollapsed((v) => !v)}
          type="button"
          className="
            w-full flex items-center justify-center gap-1.5
            py-2 px-4 text-xs font-mono text-white/25
            border-t border-white/[0.06]
            hover:text-white/50 hover:bg-white/[0.02]
            transition-all duration-150 select-none
          "
        >
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
          <span>{collapsed ? `Show all ${lineCount} lines` : "Collapse"}</span>
        </button>
      )}
    </div>
  );
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}