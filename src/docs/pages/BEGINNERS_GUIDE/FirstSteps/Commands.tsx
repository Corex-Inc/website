import { TipBox } from "@/components/docs/Docs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MCCommand = ({
  base,
  args,
  typedArg,
  id,
}: {
  base: string;
  args: string | string[];
  typedArg: string;
  id: string;
}) => {
  const argList = Array.isArray(args) ? args : [args];
  const activeArg = argList.find((a) => a.startsWith(typedArg)) ?? argList[0];
  const ghostText = activeArg.startsWith(typedArg)
    ? activeArg.slice(typedArg.length)
    : "";
  const baseRef = useRef<HTMLSpanElement>(null);
  const [baseWidth, setBaseWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setBaseWidth(baseRef.current?.offsetWidth ?? 0);
    };

    updateWidth();

    document.fonts.ready.then(updateWidth);

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [base]);

  return (
    <div className="!font-minecraft !text-xl !tracking-wide !my-12" translate="no">
      <div className="!relative !inline-flex !flex-col w-full">

        {argList.length > 0 && (
          <div
            className="!w-fit"
            style={{ marginLeft: `${baseWidth + 12}px` }}
          >
            {argList.sort((a, b) => Number(a === activeArg) - Number(b === activeArg)).map((arg) => {
              const isActive = arg === activeArg;
              return (
                <span className="!bottom-full !left-0 !mb-1">
                  <span className="!relative !-left-[4px] !bg-black !px-[4px] !py-[2px] !block !w-full">
                    <span className={`${isActive ? '!text-mc-e [text-shadow:2px_2px_0_theme(colors.mc.shadow-e)]' : '!text-mc-7 [text-shadow:2px_2px_0_theme(colors.mc.shadow-7)]'} !block !leading-none`}>
                      {arg}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        )}

        <div className="!bg-black/60 !border-white/20 !border-[0.5px] !px-3 !py-2 !inline-flex !items-center !leading-none w-full shadow-2xl">
          <span className="!text-mc-7 [text-shadow:2px_2px_0_theme(colors.mc.shadow-7)] !whitespace-pre" ref={baseRef}>
            {base}
          </span>

          <span className="!relative !inline-flex !items-center">
            <span
              className="!text-mc-c [text-shadow:2px_2px_0_theme(colors.mc.shadow-c)] !leading-none"
              id={id}
            >
              {typedArg}
            </span>

            <span className="!relative !inline-flex !items-center">
              <span className="!absolute !-left-[1px] !text-mc-f [text-shadow:2px_2px_0_theme(colors.mc.shadow-f)] animate-mc-blink select-none">
                _
              </span>
              <span className="!text-mc-8 [text-shadow:2px_2px_0_theme(colors.mc.shadow-8)] !leading-none">
                {ghostText}
              </span>
            </span>
          </span>
        </div>

      </div>
    </div>
  );
};


export default function Commands() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        Corex exposes a handful of in-game commands for running scripts,
        inspecting active queues, and diagnosing engine behavior.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand
        base="/run "
        args={["narrate", "...", "stop", "playsound", "playeffect", "do"]}
        typedArg="na"
        id="run"
      />

      <p>
        Creates a fresh queue, runs the given script line(s), and immediately
        disposes of the queue when done. Good for one-off commands and quick tag
        checks.
      </p>
 
      <p>
        Separate multiple instructions with <code> - </code> to run them in
        sequence inside the same queue:
      </p>
 
      <ul className="!mt-4 !mb-6">
        <li>
          <code>/run narrate "Hello world"</code>
        </li>
        <li>
          <code>/run narrate "hello" - narrate "world!"</code>
        </li>
        <li>
          <code>/run - narrate "hello" - narrate "world!"</code> - leading{" "}
          <code>-</code> is also fine.
        </li>
        <li>
          <code>{'  /run repeat 10 { - narrate <[loopIndex]> } - narrate "End"'}</code>{" "}
          - blocks work too.
        </li>
      </ul>
 
      <TipBox title="Note">
        Because each <code>/run</code> creates its own isolated queue,
        definitions set in one call are gone by the next. Use{" "}
        <code>/runs</code> when you need state to persist across commands.
      </TipBox>
 
      <div className="!mt-2">
        <strong>Permission:</strong> <code>corex.admin</code>
      </div>
 
      <hr className="!border-gray-800 !my-8" />

      <MCCommand
        base="/runs "
        args={["narrate", "...", "stop", "playsound", "playeffect", "do"]}
        typedArg="na"
        id="runs"
      />

      <p>
        Like <code>/run</code>, but the queue is <strong>persistent</strong> -
        it stays alive between commands. Every subsequent <code>/runs</code>{" "}
        call appends to the same queue, so definitions and state carry over:
      </p>
 
      <div className="!bg-[#0a0a0a] !border !border-gray-800 !rounded-lg !p-4 !font-minecraft !text-sm !leading-relaxed shadow-lg tracking-wide">
        <span className="!text-gray-500 font-mono">// works - value is defined and narrated in the same queue</span><br/>
        <span className="!text-[#55FF55]">/runs</span> <span className="!text-white">def value 1</span><br/>
        <span className="!text-[#55FF55]">/runs</span> <span className="!text-white">narrate {"<[value]>"}</span><br/>
        <br/>
        <span className="!text-gray-500 font-mono">// does NOT work - two separate queues, value is undefined in the second</span><br/>
        <span className="!text-[#FFFF55]">/run</span> <span className="!text-white">def value 1</span><br/>
        <span className="!text-[#FFFF55]">/run</span> <span className="!text-white">narrate {"<[value]>"}</span>
      </div>
 
      <p className="!mt-4">
        The queue keeps running until you explicitly kill it with{" "}
        <code>/runs stop</code>. <code>stop</code> here is just a normal script
        command, not a special argument.
      </p>
 
      <div className="!mt-2">
        <strong>Permission:</strong> <code>corex.admin</code>
      </div>
 
      <hr className="!border-gray-800 !my-8" />

      <MCCommand
        base="/corex "
        args="dumplog"
        typedArg="dump"
        id="corex-dumplog"
      />

      <p>
        Uploads the current Corex log to{" "}
        <a href="https://mclo.gs" target="_blank" rel="noreferrer">
          mclo.gs
        </a>{" "}
        and prints a shareable link. Before upload, all player IP addresses and
        UUIDs are stripped from the log.
      </p>

      <TipBox title="Privacy">
        IPs and UUIDs are replaced with placeholders server-side, before
        anything leaves your machine. The resulting paste is public, so anyone
        with the link can read it.
      </TipBox>

      <div className="!mt-2">
        <strong>Permission:</strong> <code>corex.admin</code>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand
        base="/corex "
        args="debug"
        typedArg="deb"
        id="corex-debug"
      />

      <p>
        Toggles debug mode. When on, Corex logs every tag resolution, command
        execution, and queue state transition to the console.
      </p>

      <TipBox title="Warning" type="warning">
        Debug output is very loud on a busy server. Use it to trace a specific
        script issue, then turn it off. For performance work, use{" "}
        <code>/corex trace</code> instead.
      </TipBox>

      <div className="!mt-2">
        <strong>Permission:</strong> <code>corex.admin</code>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand
        base="/corex trace "
        args={["start", "stop", "link"]}
        typedArg=""
        id="corex-trace"
      />

      <p>
        Controls the script profiler. It measures time spent in each
        instruction and produces a flame-graph report you can open in a
        browser.
      </p>

      <ul className="!mt-4 !mb-6">
        <li>
          <code>/corex trace start</code> - begins recording. Scripts keep
          running normally during profiling.
        </li>
        <li>
          <code>/corex trace stop</code> - stops recording and finalizes the
          data.
        </li>
        <li>
          <code>/corex trace link</code> - uploads the data and prints a URL to
          the viewer. Run this after <code>stop</code>.
        </li>
      </ul>

      <TipBox title="Workflow">
        Run <code>start</code>, trigger the slow behavior, then{" "}
        <code>stop</code> and <code>link</code>. The viewer breaks hotspots down
        by script and instruction.
      </TipBox>

      <div className="!mt-2">
        <strong>Permission:</strong> <code>corex.admin</code>
      </div>

    </div>
  );
}

Commands.config = {
  path: "beginners/first-steps/commands",
  title: "Commands",
  emoji: "💻",
  parent: "beginners/first-steps",
  priority: 1,
  toc: [
    { id: "run", title: "/run", level: 2 },
    { id: "runs", title: "/runs", level: 2 },
    { id: "corex-dumplog", title: "/corex dumplog", level: 2 },
    { id: "corex-debug", title: "/corex debug", level: 2 },
    { id: "corex-trace", title: "/corex trace", level: 2 },
  ],
};