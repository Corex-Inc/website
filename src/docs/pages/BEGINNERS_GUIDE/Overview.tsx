import { TipBox } from "@/components/docs/Docs";

export default function Overview() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg leading-relaxed">
        <strong>Pulse</strong> is a high-performance Minecraft server implementation designed to solve the fundamental inefficiencies of the Minecraft networking stack. 
        While traditional servers focus almost entirely on CPU logic and entity ticking, Pulse optimizes the <b>transport layer</b> to handle massive player counts and extreme-load environments without breaking a sweat.
      </p>

      <TipBox title="Drop-in Replacement">
        Pulse is a direct fork of Paper. It supports 100% of your existing Paper and Spigot plugins, including packet-level tools like ProtocolLib, Geyser, and Nexo. No code changes required.
      </TipBox>

      <h2 id="vision" className="!text-white">The Vision</h2>
      <p>
        Modern Minecraft networking is "spammy" by nature. Thousands of tiny packets are dispatched every second, causing severe CPU <strong>syscall overhead</strong> and network thread congestion (the infamous <i>"falling behind"</i> issue). 
      </p>
      <p>
        Pulse introduces the concept of <b>Smart Batching</b> — grouping outbound data into optimized, MTU-aware network pulses. This ensures maximum throughput, reduces Garbage Collection (GC) pressure, and maintains absolute visual synchronization for the client.
      </p>

      <h2 id="innovations" className="!text-white">Core Innovations</h2>
      <ul className="!marker:text-[#ff2929] space-y-2">
        <li>
          <strong className="text-white">Pulse Engine:</strong> A native Netty-level batching system that reduces Packet-Per-Second (PPS) counts by <strong>up to 97%</strong> (e.g., compressing 16,000 PPS down to just 180 PPS during stress tests).
        </li>
        <li>
          <strong className="text-white">Explosion Overhaul:</strong> Replaces thousands of lag-inducing block updates with intelligent, full-chunk resends during massive TNT or WorldEdit events.
        </li>
        <li>
          <strong className="text-white">Native Fake API:</strong> The industry's first native solution for persistent "phantom" blocks and AI-driven entities that exist only for specific players, bypassing the global network thread entirely.
        </li>
      </ul>

      <h2 id="performance" className="!text-white">Performance Goals</h2>
      <p>
        Our goal is simple: maintain a rock-solid <strong>20.0 TPS</strong> even during extreme events, like massive TNT explosions or 250+ player gatherings in a single region. Pulse protects your main thread by giving it the breathing room it deserves.
      </p>
    </div>
  );
}

Overview.config = {
  path: "introduction/overview",
  title: "Overview",
  emoji: "🚀",
  priority: 1,
  toc:[
    { id: 'vision', title: 'The Vision', level: 2 },
    { id: 'innovations', title: 'Core Innovations', level: 2 },
    { id: 'performance', title: 'Performance Goals', level: 2 },
  ]
};