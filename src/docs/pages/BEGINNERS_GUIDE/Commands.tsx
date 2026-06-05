import { TipBox } from "@/components/docs/Docs";

const MCCommand = ({ base, arg, typedArg, id }: {base: string, arg: string, typedArg: string, id: string}) => {
  const ghostText = arg.startsWith(typedArg) ? arg.slice(typedArg.length) : "";

  return (
    <div className="!font-minecraft !text-xl !tracking-wide !my-12" translate="no">
      <div className="!bg-black/60 !border-white/20 !border-[0.5px] !px-3 !py-2 !inline-flex !items-center !relative !leading-none w-full shadow-2xl">
        
        <span className="!text-mc-7 [text-shadow:2px_2px_0_theme(colors.mc.shadow-7)] !whitespace-pre">
          {base}
        </span>
        
        <span className="!relative !inline-flex !items-center">
          
          <span className="!absolute !bottom-full !left-0 !mb-1">
            <span className="!relative !-left-[4px] !bg-black !px-[4px] !py-[2px] !block">
              <span className="!text-mc-e [text-shadow:2px_2px_0_theme(colors.mc.shadow-e)] !block !leading-none">
                {arg}
              </span>
            </span>
          </span>
          
          <span className="!text-mc-c [text-shadow:2px_2px_0_theme(colors.mc.shadow-c)] !leading-none" id={id}>
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
  );
};


export default function Commands() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        Pulse operates primarily in the background, but provides a set of powerful built-in commands. These commands allow server administrators to monitor network health, inspect hardware utilization, and manage the engine in real-time.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand base="/pulse " arg="stats" typedArg="sta" id="pulse-stats" />

      <p>
        The core diagnostic tool of the Pulse engine. It displays detailed, current analytics comparing standard vanilla metrics against Pulse's optimized batching system.
      </p>

      <ul className="!mt-4 !mb-6">
        <li><code>/pulse stats network</code> — View Logical vs Physical PPS (Packets Per Second) and overall compression efficiency.</li>
        <li><code>/pulse stats cpu</code> — Estimates the amount of CPU time recovered by reducing system calls.</li>
        <li><code>/pulse stats ram</code> — Displays reduced Garbage Collection pressure and saved allocations.</li>
        <li><code>/pulse stats all</code> — Displays the complete diagnostic dashboard.</li>
      </ul>

      <div className="!bg-[#0a0a0a] !border !border-gray-800 !rounded-lg !p-4 !font-mono !text-sm !leading-relaxed shadow-lg whitespace-pre">
        <span className="!text-gray-400">--- [ <span className="!text-white">PulseMC Network</span> ] ---</span><br/>
        <span className="!text-gray-400">PPS (Logical):  </span><span className="!text-white">1094 pkt/s </span><span className="!text-gray-400">(Vanilla)</span><br/>
        <span className="!text-gray-400">PPS (Physical): </span><span className="!text-white">31 pkt/s </span><span className="!text-[#ff5555]">(Pulse)</span><br/>
        <span className="!text-gray-400">Calls Saved:    </span><span className="!text-white">3241/s </span><span className="!text-gray-400">(+100.0%)</span><br/><br/>
        
        <span className="!text-gray-400">Bandwidth:      </span><span className="!text-[#55FF55]">7801 </span><span className="!text-white">kB/s</span><br/>
        <span className="!text-gray-400">Optimized Chunks: </span><span className="!text-[#FFFF55]">14 </span><span className="!text-gray-400">(mass updates prevented)</span>

      </div>

      <div className="!mt-2">
        <strong>Permission:</strong> <code>pulse.admin</code>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand base="/pulse " arg="bar" typedArg="b" id="pulse-bar" />
      
      <p>
        Toggles a real-time performance <strong>BossBar</strong> at the top of your screen. 
        It displays live efficiency metrics without needing to spam the chat with the stats command.
      </p>

      <p>
        A high percentage on the bar indicates that the batching engine is currently catching and compressing a massive amount of network traffic (e.g., during TNT explosions or heavy entity spawning).
      </p>

      <TipBox title="Pro Tip">
        Toggle this on during massive server events or PvP tournaments to monitor network stability on the fly. The BossBar is only visible to the player who executed the command.
      </TipBox>

      <div className="!mt-2 !mb-6">
        <strong>Permission:</strong> <code>pulse.admin</code>
      </div>

      <hr className="!border-gray-800 !my-8" />

      <MCCommand base="/run " arg="reload" typedArg="relo" id="pulse-reload" />
      
      <p>
        Safely reloads the <code>pulse.yml</code> configuration file and restarts internal network tasks.
      </p>
      
      <p>
        Pulse is designed to be highly dynamic. Changing <code>max-batch-bytes</code>, MTU safety limits, or adding new packets to the <code>instant-packets</code> list will take effect immediately upon reloading.
      </p>

      <TipBox title="Safe to use" type="warning">
        Unlike some core modifications, executing this command is 100% safe to use on a live production server. It will not disconnect active players or drop pending packets.
      </TipBox>

      <div className="!mt-2">
        <strong>Permission:</strong> <code>pulse.admin</code>
      </div>

    </div>
  );
}

Commands.config = {
  path: "beginners/commands",
  title: "Commands",
  emoji: "💻",
  priority: 2,
  toc:[
    { id: 'pulse-stats', title: '/pulse stats', level: 2 },
    { id: 'pulse-bar', title: '/pulse bar', level: 2 },
    { id: 'pulse-reload', title: '/pulse reload', level: 2 }
  ]
};