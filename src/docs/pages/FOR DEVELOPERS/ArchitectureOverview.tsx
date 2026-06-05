import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

const DiagramBox = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`!bg-black/40 !border !border-white/10 !rounded !px-4 !py-3 !text-center !font-mono !text-sm ${className}`}>
    {children}
  </div>
);

const Arrow = ({ label, vertical = false }: { label?: string; vertical?: boolean }) => (
  vertical ? (
    <div className="!flex !flex-col !items-center !gap-0.5 !my-1">
      {label && <span className="!text-xs !text-gray-500 !font-mono">{label}</span>}
      <span className="!text-gray-500 !text-lg !leading-none" translate="no">v</span>
    </div>
  ) : (
    <div className="!flex !items-center !gap-1 !mx-2">
      {label && <span className="!text-xs !text-gray-500 !font-mono">{label}</span>}
      <span className="!text-gray-500 !text-lg !leading-none" translate="no">-{">"}</span>
    </div>
  )
);

export default function ArchitectureOverview() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        Corex is a custom Minecraft scripting engine for Paper and Folia servers. It takes human-readable <code>.cx</code> script files, compiles them into bytecode, and executes them inside isolated <strong>queues</strong>. This page is a map of the entire system - read it before diving into any individual API.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="lifecycle">The Script Lifecycle</h2>
      <p>
        From a raw <code>.cx</code> file to a running effect in-game, every script goes through four stages:
      </p>

      <div className="!not-prose !my-8 !flex !flex-col !items-center !gap-0">
        <DiagramBox className="!w-full !max-w-xl !border-blue-500/30 !bg-blue-950/20">
          <span className="!text-blue-300">📄 .cx file on disk</span>
          <div className="!text-xs !text-gray-500 !mt-1">scripts/my_task.cx</div>
        </DiagramBox>
        
        <Arrow vertical label="ScriptManager.load()" />
        
        <DiagramBox className="!w-full !max-w-xl !border-yellow-500/30 !bg-yellow-950/20">
          <span className="!text-yellow-300">⚙️ ScriptCompiler</span>
          <div className="!text-xs !text-gray-500 !mt-1">parses lines -{">"} <code>Instruction[]</code> bytecode</div>
        </DiagramBox>
        
        <Arrow vertical label="ScriptQueue.pushFrame()" />
        
        <DiagramBox className="!w-full !max-w-xl !border-purple-500/30 !bg-purple-950/20">
          <span className="!text-purple-300">🏃 ScriptQueue</span>
          <div className="!text-xs !text-gray-500 !mt-1">executes instructions one by one</div>
        </DiagramBox>
        
        <Arrow vertical label="per instruction" />
        
        {/* Изменено: max-w-xl, а также добавлено !grid-cols-1 sm:!grid-cols-3 для телефонов */}
        <div className="!w-full !max-w-xl !grid !grid-cols-1 sm:!grid-cols-3 !gap-2">
          <DiagramBox className="!border-green-500/30 !bg-green-950/20 !px-2">
            <span className="!text-green-300 !text-xs">AbstractCommand</span>
            <div className="!text-xs !text-gray-500 !mt-1">runs actions</div>
          </DiagramBox>
          <DiagramBox className="!border-orange-500/30 !bg-orange-950/20 !px-2">
            <span className="!text-orange-300 !text-xs">TagProcessor</span>
            <div className="!text-xs !text-gray-500 !mt-1">resolves tags</div>
          </DiagramBox>
          <DiagramBox className="!border-red-500/30 !bg-red-950/20 !px-2">
            <span className="!text-red-300 !text-xs">SchedulerAdapter</span>
            <div className="!text-xs !text-gray-500 !mt-1">waits / threads</div>
          </DiagramBox>
        </div>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="tags">The Tag System</h2>
      <p>
        Tags are the data layer of Corex. Every value - a player, a location, a number, a list - is an <code>AbstractTag</code>.
        Tags are identified by a canonical string in the form <code>prefix@data</code> (e.g. <code>p@Steve</code>, <code>l@world,0,64,0</code>).
      </p>
      <p>
        When a script contains <code>{"<player.name>"}</code>, the engine resolves it through a chain:
      </p>

      <div className="!not-prose !my-6 !flex !flex-wrap !items-center !justify-center !gap-1">
        <DiagramBox className="!border-purple-500/30 !bg-purple-950/20">
          <span className="!text-purple-300 !text-xs">{"<player.name>"}</span>
          <div className="!text-xs !text-gray-500 !mt-1">raw string</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!border-yellow-500/30 !bg-yellow-950/20">
          <span className="!text-yellow-300 !text-xs">ObjectFetcher</span>
          <div className="!text-xs !text-gray-500 !mt-1">finds PlayerTag</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!border-orange-500/30 !bg-orange-950/20">
          <span className="!text-orange-300 !text-xs">TagProcessor</span>
          <div className="!text-xs !text-gray-500 !mt-1">runs "name" handler</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!border-green-500/30 !bg-green-950/20">
          <span className="!text-green-300 !text-xs">ElementTag</span>
          <div className="!text-xs !text-gray-500 !mt-1">"Steve"</div>
        </DiagramBox>
      </div>

      <p>
        If the local <code>TagProcessor</code> has no handler for <code>.name</code>, it falls through to the <code>GlobalTagProcessor</code>, which provides universal tags available on every object (e.g. <code>.as[type]</code>, <code>.if[...]</code>).
      </p>

      <TipBox title="Key rule">
        Every tag class must call <code>ObjectFetcher.registerFetcher("prefix", constructor)</code> so the engine can reconstruct it from a stored <code>identify()</code> string - flags, <code>def</code> values, and cross-queue passing all depend on this.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="commands">Commands vs Tags</h2>
      <p>
        These are the two primary extension points, and they serve completely different roles:
      </p>

      <div className="!not-prose !my-6 !grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
        <div className="!bg-black/40 !border !border-green-500/20 !rounded !p-4">
          <div className="!text-green-300 !font-mono !text-sm !font-bold !mb-2">AbstractCommand</div>
          <ul className="!text-sm !text-gray-400 !space-y-1 !list-none !pl-0 !m-0">
            <li>-{">"} Performs an <strong className="!text-gray-200">action</strong></li>
            <li>-{">"} Written as a script line: <code className="!text-xs">- teleport {"{player}"} to:spawn</code></li>
            <li>-{">"} Can pause the queue (<code>wait</code>), branch (<code>if</code>), or throw</li>
            <li>-{">"} Reads args via <code>Instruction</code></li>
          </ul>
        </div>
        <div className="!bg-black/40 !border !border-orange-500/20 !rounded !p-4">
          <div className="!text-orange-300 !font-mono !text-sm !font-bold !mb-2">AbstractTag / TagProcessor</div>
          <ul className="!text-sm !text-gray-400 !space-y-1 !list-none !pl-0 !m-0">
            <li>-{">"} Returns a <strong className="!text-gray-200">value</strong></li>
            <li>-{">"} Used inline: <code className="!text-xs">{"<player.location.world>"}</code></li>
            <li>-{">"} Must be pure - no side effects</li>
            <li>-{">"} Reads params via <code>Attribute</code></li>
          </ul>
        </div>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="events">Event Flow</h2>
      <p>
        Events bridge the Bukkit/Paper listener system and Corex scripts. When a Bukkit event fires, your <code>AbstractEvent</code> implementation fires a <code>ScriptQueue</code>, passes a <code>ContextTag</code> with event data into it, and optionally reads back prefixed return values to modify the event outcome (e.g. cancelling it, changing a damage value).
      </p>

      <div className="!not-prose !my-6 !flex !flex-col !items-center !gap-0">
        <DiagramBox className="!w-full !max-w-md !border-gray-500/30">
          <span className="!text-gray-300">Bukkit <code>@EventHandler</code></span>
        </DiagramBox>
        <Arrow vertical />
        <DiagramBox className="!w-full !max-w-md !border-blue-500/30 !bg-blue-950/20">
          <span className="!text-blue-300">AbstractEvent.check()</span>
          <div className="!text-xs !text-gray-500 !mt-1">pattern match, build ContextTag</div>
        </DiagramBox>
        <Arrow vertical label="EventRegistry.fire()" />
        <DiagramBox className="!w-full !max-w-md !border-purple-500/30 !bg-purple-950/20">
          <span className="!text-purple-300">ScriptQueue execution</span>
          <div className="!text-xs !text-gray-500 !mt-1">runs matching script containers</div>
        </DiagramBox>
        <Arrow vertical label="queue.getReturns()" />
        <DiagramBox className="!w-full !max-w-md !border-green-500/30 !bg-green-950/20">
          <span className="!text-green-300">EventReturn.getPrefixed()</span>
          <div className="!text-xs !text-gray-500 !mt-1">apply returned values back to Bukkit event</div>
        </DiagramBox>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="folia">Folia & Threading</h2>
      <p>
        Corex targets both Paper and Folia. Folia splits the world into independently-ticking regions, which means you <strong>cannot</strong> call Bukkit API from an arbitrary thread - you must be on the correct region thread for a given location.
      </p>
      <p>Corex handles this transparently via two mechanisms:</p>
      <ul>
        <li><strong>SchedulerAdapter</strong> - wraps all task scheduling (run on region, run global, run async) in a single API that works on both Paper and Folia.</li>
        <li><strong>RegionRelocateException</strong> - thrown when a command needs to continue execution on a different region thread. The queue catches it, reschedules itself on the correct thread, and resumes where it left off.</li>
      </ul>

      <TipBox title="Rule of thumb" type="warning">
        Never call Bukkit location-sensitive API directly in a command's <code>run()</code> without going through <code>SchedulerAdapter</code>. If you're unsure which thread you're on, use <code>SchedulerAdapter.runOnRegion(location, task)</code>.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="registration">Registration</h2>
      <p>
        All API components - tags, commands, events, global flags, data actions - must be registered before they can be used. Everything goes through <code>CorexRegistry</code>, which is the single entry point called during plugin startup.
      </p>

      <DocsCodeBlock lang="java" title="Plugin onEnable - registering components" text={`
// After Corex plugin loads:
CorexRegistry registry = Corex.getInstance().getRegistry();

registry.register(
    MyTag.class,
    MyCommand.class,
    MyEvent.class
);
`} />

      <p>
        <strong>Next:</strong> Start with <strong>Core Concepts -{">"} Tags & Objects</strong> to learn how to create your first <code>AbstractTag</code>, or jump straight to <strong>Commands</strong> if you want to add script actions.
      </p>

    </div>
  );
}

ArchitectureOverview.config = {
  path: "developers/architecture",
  title: "Architecture Overview",
  emoji: "🗺️",
  priority: 1,
  toc: [
    { id: "lifecycle", title: "Script Lifecycle", level: 2 },
    { id: "tags", title: "The Tag System", level: 2 },
    { id: "commands", title: "Commands vs Tags", level: 2 },
    { id: "events", title: "Event Flow", level: 2 },
    { id: "folia", title: "Folia & Threading", level: 2 },
    { id: "registration", title: "Registration", level: 2 },
  ],
};