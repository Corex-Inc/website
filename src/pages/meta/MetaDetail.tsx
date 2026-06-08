import { AlertTriangle, ArrowUpRight, Ban, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { highlightCode } from '@/lib/highlighter';
import type { MetaCommand, MetaDefault, MetaEvent, MetaFormatter, MetaItem, MetaMechanism, MetaObject, MetaTag } from './types.ts';

function asLines(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split('\n');
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-white/50">{label}</p>
      {children}
    </div>
  );
}

function Description({ value }: { value: string | string[] | undefined }) {
  const lines = asLines(value);
  if (!lines.length) return null;
  return (
    <Field label="Description">
      <div className="space-y-1.5">
        {lines.map((line) => (
          <p key={line} className="text-[15px] text-white/80 leading-relaxed">{line}</p>
        ))}
      </div>
    </Field>
  );
}

function UsageBlock({ value }: { value: string | string[] | undefined }) {
  const entries = useMemo(() => {
    return Array.isArray(value) ? value : value ? [value] : [];
  }, [value]);

  const [highlightedHtml, setHighlightedHtml] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (!entries.length) {
      setHighlightedHtml([]);
      return;
    }

    Promise.all(entries.map(entry => highlightCode(entry, 'corex')))
      .then(results => {
        if (active) {
          setHighlightedHtml(results);
        }
      })
      .catch(err => console.error('Highlighting failed:', err));

    return () => {
      active = false;
    };
  }, [entries]);

  if (!entries.length) return null;
  if (highlightedHtml.length !== entries.length) return null;

  return (
    <Field label="Snippet">
      <div className="space-y-2 bg-[#121314] border border-white/[0.05] rounded-lg p-4 overflow-auto [&::-webkit-scrollbar]:h-[6px]">
        {highlightedHtml.map((html) => (
          <div key={html} className="font-mono text-[13px] py-2 text-white/80 whitespace-pre-wrap break-words">
            <pre
              className="m-0 bg-transparent p-0"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighter
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ))}
      </div>
    </Field>
  );
}

function PropertyBadge({ icon: Icon, label, colorClass }: { icon: React.ElementType, label: string, colorClass: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] font-medium shadow-sm ${colorClass}`}>
      <Icon size={15} />
      <span>{label}</span>
    </div>
  );
}

function ItemProperties({ item }: { item: MetaItem }) {
  const badges = [];

  if (item.type === 'event') {
    const ev = item as MetaEvent;
    
    if (ev.cancellable !== undefined) {
      badges.push(<PropertyBadge key="cancellable" icon={Ban} label="Cancellable" colorClass="bg-red-500/10 border-red-500/20 text-red-400" />);
    }
  }

  if (item.type === 'command') {
    const cmd = item as MetaCommand;
    
    if (cmd.waitable !== undefined) {
      badges.push(<PropertyBadge key="waitable" icon={Clock} label="Waitable" colorClass="bg-blue-500/10 border-blue-500/20 text-blue-400" />);
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {badges}
    </div>
  );
}

function CommandDetail({ item }: { item: MetaCommand }) {
  const [highlightedSyntax, setHighlightedSyntax] = useState<string>('');

  useEffect(() => {
    let active = true;
    
    if (!item.syntax) {
      setHighlightedSyntax('');
      return;
    }
    
    highlightCode((`- ${item.syntax}`), 'corex')
      .then(res => {
        if (active) setHighlightedSyntax(res);
      })
      .catch(err => console.error('Syntax highlighting failed:', err));

    return () => {
      active = false;
    };
  }, [item.syntax]);

  return (
    <>
      <Field label="Syntax">
        <div className="bg-[#121314] border border-white/[0.05] rounded-lg px-4 py-3">
          {highlightedSyntax ? (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighter
            <div className='overflow-auto [&::-webkit-scrollbar]:h-[3px]' dangerouslySetInnerHTML={{ __html: highlightedSyntax }} />
          ) : (
            <code className="font-mono text-[14px] text-white/90">- {item.syntax}</code>
          )}
        </div>
      </Field>
      
      <Description value={item.description} />
      <UsageBlock value={item.usage} />
    </>
  );
}

function TagDetail({ item }: { item: MetaTag }) {
  const [highlightedSyntax, setHighlightedSyntax] = useState<string>('');

  useEffect(() => {
    let active = true;
    
    if (!item.rawname) {
      setHighlightedSyntax('');
      return;
    }
    
    highlightCode(item.rawname, 'corex')
      .then(res => {
        if (active) setHighlightedSyntax(res);
      })
      .catch(err => console.error('Syntax highlighting failed:', err));

    return () => {
      active = false;
    };
  }, [item.rawname]);

  return (
    <>
      <Field label="Syntax">
        <div className="bg-[#121314] border border-white/[0.05] rounded-lg px-4 py-3">
          {highlightedSyntax ? (
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighter
            <div className='overflow-auto [&::-webkit-scrollbar]:h-[3px]' dangerouslySetInnerHTML={{ __html: highlightedSyntax }} />
          ) : (
            <code className="font-mono text-[14px] text-white/90">{item.rawname}</code>
          )}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Object">
          <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-2">
            <span className="font-mono text-[13px] text-white/70">{item.object}</span>
          </div>
        </Field>
        <Field label="Returns">
          <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-2">
            <span className="font-mono text-[13px] text-white/70">{item.returntype}</span>
          </div>
        </Field>
      </div>
      <Description value={item.description} />
    </>
  );
}

function ObjectDetail({ item }: { item: MetaObject }) {
  return (
    <>
      <Field label="Prefix">
        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-3 inline-block">
          <code className="font-mono text-[14px] text-white/90">{item.prefix}@...</code>
        </div>
      </Field>
      <Field label="Format">
        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-3 space-y-1">
          {asLines(item.format).map((line) => (
            <p key={line} className="text-[13px] text-white/70 font-mono leading-relaxed">{line}</p>
          ))}
        </div>
      </Field>
      <Description value={item.description} />
    </>
  );
}

function FormatterDetail({ item }: { item: MetaFormatter }) {
  return (
    <>
      <Description value={item.description} />
      <UsageBlock value={item.usage} />
    </>
  );
}

function MechanismDetail({ item }: { item: MetaMechanism }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {item.object && (
          <Field label="Object">
            <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-2">
              <span className="font-mono text-[13px] text-white/70">{item.object}</span>
            </div>
          </Field>
        )}
        {item.input && (
          <Field label="Input">
            <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-2">
              <span className="font-mono text-[13px] text-white/70">{item.input}</span>
            </div>
          </Field>
        )}
      </div>
      <Description value={item.description} />
    </>
  );
}

function EventDetail({ item }: { item: MetaEvent }) {
  const eventLines = asLines(item.events);
  const contextLines = asLines(item.context);

  return (
    <>
      {eventLines.length > 0 && (
        <Field label="Event syntax">
          <div className="space-y-1.5">
            {eventLines.map((e) => (
              <div key={e} className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg px-4 py-2.5">
                <code className="font-mono text-[14px] text-white/90">{e}</code>
              </div>
            ))}
          </div>
        </Field>
      )}
      
      <Description value={item.description} />
      {contextLines.length > 0 && (
        <Field label="Context">
          <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-4 space-y-2">
            {contextLines.map((c) => {
              const [tag, ...rest] = c.split(' - ');
              return (
                <div key={c} className="flex flex-col gap-1 text-[13px]">
                  <code className="font-mono text-white/80">{tag.trim()} <span className='text-gray-500'>- {rest}</span></code>
                </div>
              );
            })}
          </div>
        </Field>
      )}
      <UsageBlock value={item.usage} />
    </>
  );
}

function WarningBlock({ value }: { value: string | string[] | undefined }) {
  const lines = asLines(value);
  if (!lines.length) return null;
  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3.5 mb-8">
      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-1.5">Warning</p>
        {lines.map((line) => (
          <p key={line} className="text-[14px] text-orange-200/90 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function renderDetail(item: MetaItem) {
  switch (item.type) {
    case 'command': return <CommandDetail item={item as MetaCommand} />;
    case 'tag': return <TagDetail item={item as MetaTag} />;
    case 'object': return <ObjectDetail item={item as MetaObject} />;
    case 'formatter': return <FormatterDetail item={item as MetaFormatter} />;
    case 'mechanism': return <MechanismDetail item={item as MetaMechanism} />;
    case 'event': return <EventDetail item={item as MetaEvent} />;
    default: return <Description value={(item as MetaDefault).description} />;
  }
}

function corexToDenizenType(type: string) {
  switch (type) {
    case 'command': return "Commands";
    case 'tag': return "Tags";
    case 'object': return "ObjectTypes";
    case 'formatter': return "Tags";
    case 'mechanism': return "Mechanisms";
    case 'event': return "Events";
    default: return "";
  }
}

interface MetaDetailProps {
  item: MetaItem;
  selectedAddon: string;
}

export function MetaDetail({ item, selectedAddon }: MetaDetailProps) {
  const safeId = `meta-${item.type}-${item.name.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const warningValue = 'warning' in item ? (item as MetaDefault).warning : undefined;

  return (
    <article id={safeId} className="scroll-mt-[110px]">
      <div className="bg-[#141414] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300">
        
        <div className="mb-6 space-y-3">
          <h1 className="text-[32px] font-semibold text-white font-unbounded tracking-tight">{item.name}</h1>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded font-medium bg-white/10 text-white/50 capitalize">
              {item.type}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded font-medium bg-white/10 text-white/50">
              {selectedAddon}
            </span>
          </div>
          
          {'shortdescription' in item && (item as MetaCommand).shortdescription && (
            <p className="text-[15px] text-white/50 mt-4">{(item as MetaCommand).shortdescription}</p>
          )}
        </div>

        <ItemProperties item={item} />

        <WarningBlock value={warningValue} />

        <div className="space-y-8">
          {renderDetail(item)}
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex gap-5">
          <a
            href={item.url}
            className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>View on GitHub</span>
            <ArrowUpRight
              size={14}
              className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
            />
          </a>
          {item.implements && (
            <a
              href={`https://meta.denizenscript.com/Docs/${corexToDenizenType(item.type)}/${encodeURI(item.implements)}`}
              className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>View on Denizen Meta Docs</span>
              <ArrowUpRight
                size={14}
                className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
              />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}