import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

const DiagramBox = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`!bg-black/40 !border !border-white/10 !rounded !px-4 !py-3 !text-center !font-mono !text-sm ${className}`}>
    {children}
  </div>
);
const Arrow = ({ label }: { label?: string }) => (
  <div className="!flex !flex-col !items-center !gap-0.5 !my-1">
    {label && <span className="!text-xs !text-gray-500 !font-mono">{label}</span>}
    <span className="!text-gray-500 !text-lg !leading-none" translate="no">v</span>
  </div>
);

export default function ScriptQueuePage() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        <code>ScriptQueue</code> is the core execution unit of the Corex Virtual Machine (CVM). Every running script - whether triggered by an event, a command, or a scheduler - executes inside its own isolated queue. Understanding how it works is essential before writing any addon.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="anatomy">Anatomy of a Queue</h2>
      <p>
        A queue is constructed with an ID, a compiled <code>Instruction[]</code> array (bytecode), an async flag, and an optional linked player. Everything else - definitions, the call stack, return values - starts empty:
      </p>

      <DocsCodeBlock lang="java" title="ScriptQueue construction" text={`
ScriptQueue queue = new ScriptQueue(
    "my-queue-001",   // unique ID
    bytecode,         // Instruction[] from ScriptCompiler
    false,            // isAsync
    playerIdentity,   // nullable
    anchorPosition    // nullable - used for Folia region scheduling
);
queue.start();
`} />

      <p>
        Calling <code>start()</code> registers the queue in the global <code>activeQueues</code> map and begins the execution loop via <code>executeNext()</code>.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="execution-loop">The Execution Loop</h2>
      <p>
        <code>executeNext()</code> is the main loop. On every iteration it:
      </p>

      <div className="!not-prose !my-8 !flex !flex-col !items-center">
        <DiagramBox className="!w-full !max-w-lg !border-blue-500/30 !bg-blue-950/20">
          <span className="!text-blue-300">Check targetRegionPosition</span>
          <div className="!text-xs !text-gray-500 !mt-1">if Folia needs relocation -{">"} pause, reschedule on correct region thread, return</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!w-full !max-w-lg !border-yellow-500/30 !bg-yellow-950/20">
          <span className="!text-yellow-300">Read bytecode[pointer++]</span>
          <div className="!text-xs !text-gray-500 !mt-1">get next Instruction</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!w-full !max-w-lg !border-purple-500/30 !bg-purple-950/20">
          <span className="!text-purple-300">Evaluate GlobalFlags</span>
          <div className="!text-xs !text-gray-500 !mt-1">each flag can veto execution of the command</div>
        </DiagramBox>
        <Arrow />
        <DiagramBox className="!w-full !max-w-lg !border-green-500/30 !bg-green-950/20">
          <span className="!text-green-300">inst.command.run(queue, inst)</span>
          <div className="!text-xs !text-gray-500 !mt-1">execute the AbstractCommand</div>
        </DiagramBox>
        <Arrow />
        <div className="!w-full !max-w-lg !grid !grid-cols-2 !gap-2">
          <DiagramBox className="!border-gray-500/30">
            <span className="!text-gray-300 !text-xs">pointer &lt; bytecode.length</span>
            <div className="!text-xs !text-gray-500 !mt-1">-{">"} loop again</div>
          </DiagramBox>
          <DiagramBox className="!border-orange-500/30 !bg-orange-950/20">
            <span className="!text-orange-300 !text-xs">pointer == bytecode.length</span>
            <div className="!text-xs !text-gray-500 !mt-1">-{">"} pop frame or stop</div>
          </DiagramBox>
        </div>
      </div>

      <p>
        The loop exits when <code>isPaused</code> or <code>isStopped</code> becomes true. This means <strong>the queue is synchronous by default</strong> - it processes all instructions in the current frame before yielding. A <code>wait</code> command calls <code>pause()</code> and schedules a future <code>resume()</code>, returning control to the server thread immediately.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="call-stack">The Call Stack</h2>
      <p>
        Nested blocks - <code>if</code> bodies, <code>repeat</code> loops, <code>run</code> sub-scripts - are handled via a <code>QueueFrame</code> call stack (<code>ArrayDeque</code>). When entering a block, the current execution state is saved and replaced:
      </p>

      <DocsCodeBlock lang="java" title="pushFrame - entering a nested block" text={`
// Called by the 'if' or 'repeat' command from inside run():
queue.pushFrame(
    "my_loop_body",     // debug name
    loopBytecode,       // new Instruction[] to execute
    () -> { /* onFinish callback - runs when block exits */ },
    () -> counter++ < 10  // loopCondition - if non-null, resets pointer to 0 when true
);
`} />

      <p>
        When the inner block runs out of instructions, the queue checks <code>loopCondition</code>. If it returns <code>true</code>, <code>pointer</code> is reset to <code>0</code> and the block runs again. Otherwise the frame is popped and execution resumes in the parent frame.
      </p>

      <p>
        To exit a loop early (e.g. from a <code>stop</code> command), call <code>queue.skipFrame(true)</code> - it advances <code>pointer</code> to the end of the current bytecode and sets <code>isBroken = true</code>, which suppresses the loop restart check.
      </p>

      <TipBox title="getDepth()">
        <code>queue.getDepth()</code> returns the current call stack size. The debugger uses this to indent error output so you can tell which nested block an error came from.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="pause-resume">Pause, Resume & Delay</h2>
      <p>
        A command that needs to wait - for a tick, for async work, for player input - calls <code>pause()</code>, does its work, then calls <code>resume()</code>. The queue remembers exactly where it was:
      </p>

      <DocsCodeBlock lang="java" title="Implementing a wait command via pause/resume" text={`
@Override
public void run(ScriptQueue queue, Instruction inst) {
    long ticks = /* parse duration from inst */ 20L;

    // queue.delay() is a built-in shortcut for pause + runLater(resume)
    queue.delay(ticks);

    // Execution of THIS command returns immediately.
    // The queue is paused. resume() fires after ticks.
}
`} />

      <p>
        For async-safe commands, <code>delay()</code> automatically uses <code>SchedulerAdapter.runAsyncLater()</code> when <code>queue.isAsync()</code> is true, and <code>runLater()</code> otherwise.
      </p>

      <TipBox title="isAsyncSafe() check" type="warning">
        Before running a command, the loop checks <code>inst.command.isAsyncSafe()</code>. If the queue is async and the command is not marked safe, the queue is immediately stopped with an error. Always override <code>isAsyncSafe()</code> on your commands if they are safe to call off the main thread.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="definitions">Definitions (Local Variables)</h2>
      <p>
        Definitions are the queue's local variable store - a plain <code>Map&lt;String, AbstractTag&gt;</code> (or <code>ConcurrentHashMap</code> in async queues). Commands read and write them via:
      </p>

      <DocsCodeBlock lang="java" title="Reading and writing definitions" text={`
// Store a value (e.g. from a 'def' command):
queue.define("myPlayer", playerTag);

// Read it back (e.g. to resolve <def[myPlayer]>):
AbstractTag val = queue.getDefinition("myPlayer"); // null if missing

// Delete:
queue.define("myPlayer", null);
`} />

      <p>
        The special definition <code>__player</code> overrides the linked player returned by <code>getPlayer()</code>. Commands like <code>foreach</code> use this to temporarily repoint the queue's player context as they iterate over a list.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="returns">Return Values</h2>
      <p>
        Queues can produce output - return values are used by events (to cancel, modify damage, etc.) and by <code>run</code> sub-scripts. Any command can push a value:
      </p>

      <DocsCodeBlock lang="java" title="Pushing and reading return values" text={`
// In a command (e.g. 'determine cancel'):
queue.addReturn(new ElementTag("true"));

// After a sub-queue finishes (e.g. from an event handler):
List<AbstractTag> results = queue.getReturns();
`} />

      <p>
        For events, Corex follows a naming convention: the event system looks for returns prefixed with the event outcome name (e.g. <code>"cancelled:true"</code>). See the Events section for how <code>EventReturn</code> uses this.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="folia">Folia Region Scheduling</h2>
      <p>
        A queue can be anchored to a world position via <code>setAnchorPosition()</code>. When a command needs to run on a specific region (e.g. teleporting a player to a different chunk), it calls <code>queue.setTargetRegion(position)</code> and throws a <code>RegionRelocateException</code>.
      </p>

      <p>
        The execution loop catches this exception, decrements <code>pointer</code> (so the instruction reruns), pauses the queue, and reschedules <code>executeNext()</code> on the correct region thread via <code>SchedulerAdapter</code>. From your command's perspective, it just retries on the right thread:
      </p>

      <DocsCodeBlock lang="java" title="Requesting a region shift from a command" text={`
@Override
public void run(ScriptQueue queue, Instruction inst) {
    Position target = /* resolve target location */;

    // Ask the queue to shift to target's region before re-running this command
    queue.setTargetRegion(target);
    throw new RegionRelocateException(target);

    // After the exception, executeNext() reschedules this exact instruction
    // on the correct Folia region thread and clears targetRegionPosition.
    // On Paper (non-Folia), SchedulerAdapter.needsRegionRelocation() always
    // returns false, so this path is never taken.
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="keepalive">Keep-Alive Queues</h2>
      <p>
        Normally a queue stops and is removed from <code>activeQueues</code> when it runs out of instructions. Setting <code>keepAlive = true</code> changes this: the queue enters a waiting state and can accept new instructions later via <code>injectInstructions()</code>. This is used for long-lived interactive flows (e.g. a dialogue system or a command prompt):
      </p>

      <DocsCodeBlock lang="java" title="Keep-alive queue with injected instructions" text={`
queue.setKeepAlive(true);
queue.start();

// Later, from anywhere:
ScriptQueue q = ScriptQueue.getQueueById("dialogue-queue-001");
if (q != null) {
    q.injectInstructions(newInstructions);
    // If the queue was waiting, it resumes immediately.
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="temp-data">Temp Data</h2>
      <p>
        <code>tempData</code> is a <code>Map&lt;String, Object&gt;</code> for internal command communication within a single execution cycle. Unlike definitions (which hold <code>AbstractTag</code> values and are part of the scripting layer), temp data holds raw Java objects and is intended for one command to pass state to the next without going through tag serialization:
      </p>

      <DocsCodeBlock lang="java" title="Using tempData between commands" text={`
// Command A - stores raw data
queue.setTempData("pending_entity", entity);

// Command B - reads it back
Entity e = (Entity) queue.getTempData("pending_entity");
queue.setTempData("pending_entity", null); // clean up
`} />

      <TipBox title="Temp data is not persistent">
        Temp data is never serialized, never survives a <code>pause()/resume()</code> cycle on a different thread, and has no garbage-collection guarantee. Use definitions for anything script-visible; use temp data only for tight intra-command communication.
      </TipBox>

    </div>
  );
}

ScriptQueuePage.config = {
  path: "developers/script-queue",
  title: "ScriptQueue",
  emoji: "⚙️",
  priority: 3,
  toc: [
    { id: "anatomy", title: "Anatomy of a Queue", level: 2 },
    { id: "execution-loop", title: "The Execution Loop", level: 2 },
    { id: "call-stack", title: "The Call Stack", level: 2 },
    { id: "pause-resume", title: "Pause, Resume & Delay", level: 2 },
    { id: "definitions", title: "Definitions", level: 2 },
    { id: "returns", title: "Return Values", level: 2 },
    { id: "folia", title: "Folia Region Scheduling", level: 2 },
    { id: "keepalive", title: "Keep-Alive Queues", level: 2 },
    { id: "temp-data", title: "Temp Data", level: 2 },
  ],
};