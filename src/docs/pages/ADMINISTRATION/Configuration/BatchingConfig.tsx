import { ConfigOption, TipBox } from "@/components/docs/Docs";

export default function BatchingConfig() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        The Batching Engine is responsible for intercepting thousands of outbound network packets and compressing them into highly efficient TCP segments.
      </p>

      <h2 id="mode">Batching Mode</h2>
      <ConfigOption name="batching.mode" type="String" def="SMART_EXECUTION">
        <p>Defines the strategy Pulse uses to release packets to the network.</p>
        <ul>
          <li><strong>SMART_EXECUTION:</strong> <em>(Recommended)</em> Evaluates logic chains and flushes the buffer dynamically when necessary or at tick end. Provides the best balance of zero-latency and high throughput.</li>
          <li><strong>STRICT_TICK:</strong> Forces the engine to wait strictly for the 50ms tick boundary. Yields maximum CPU efficiency but may introduce a marginal latency footprint.</li>
          <li><strong>INTERVAL:</strong> Ignores TPS completely and flushes the buffer every X milliseconds.</li>
        </ul>
      </ConfigOption>

      <ConfigOption name="batching.flush-interval" type="Integer" def="25">
        <p>Used only when mode is set to <code>INTERVAL</code>. Defines the delay (in milliseconds) between network flushes.</p>
      </ConfigOption>

      <h2 id="limits">Buffer Limits & MTU</h2>
      <p>These limits dictate when Pulse is forced to flush the buffer early to prevent data loss or fragmentation.</p>

      <ConfigOption name="batching.max-batch-size" type="Integer" def="128">
        <p>The maximum number of logical packets allowed in a single batch before an emergency flush is triggered.</p>
        <TipBox title="Tuning Advice">
          For <strong>0-50 players</strong>, keep this at <code>64-128</code>.<br/>
          For <strong>100+ players</strong>, increase to <code>256-512</code> to handle massive events.<br/>
          <em>If players report "input lag", lower this value. If your CPU is struggling, increase it.</em>
        </TipBox>
      </ConfigOption>

      <ConfigOption name="batching.max-batch-bytes" type="Integer" def="1500">
        <p>The absolute size limit (in bytes) of the buffer. In networking, smaller is often safer (like the 1460 MTU standard), but Minecraft proxies (Velocity/Bungee) can handle massive frames.</p>
        <p>Setting this to 32000 allows for extreme 99% compression ratios on local networks or high-end proxies.</p>
      </ConfigOption>

      <ConfigOption name="batching.safety-margin-bytes" type="Integer" def="64">
        <p>Pulse checks if the remaining buffer space is less than this margin before adding a new packet. It prevents expensive per-packet size calculations and avoids MTU overflows.</p>
      </ConfigOption>

      <h2 id="instant">Bypassing the Buffer</h2>

      <ConfigOption name="batching.instant-packets" type="List<String>" def="[...List]">
        <p>A crucial list of NMS packet names that will <strong>never</strong> be delayed. When Pulse detects these packets, they are immediately fired into the Netty pipeline.</p>
        <p>By default, it includes <code>ClientboundHurtAnimationPacket</code> and <code>ClientboundDamageEventPacket</code> to ensure PvP hit registration feels perfectly vanilla and snappy.</p>
      </ConfigOption>

    </div>
  );
}

BatchingConfig.config = {
  path: "administration/configuration/batching",
  title: "Batching Engine",
  emoji: "📦",
  priority: 2,
  parent: "administration/configuration",
  toc:[
    { id: 'mode', title: 'Batching Mode', level: 2 },
    { id: 'limits', title: 'Buffer Limits', level: 2 },
    { id: 'instant', title: 'Bypassing the Buffer', level: 2 },
  ]
};