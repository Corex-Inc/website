import { ConfigOption } from "@/components/docs/Docs";

export default function OptCompatConfig() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <h2 id="explosions">Explosion Optimization</h2>
      <p>Pulse rewrites how massive block updates are handled, effectively neutralizing lag machines.</p>

      <ConfigOption name="optimization.explosions.enabled" type="Boolean" def="true">
        <p>Enables the Smart Chunk Resend algorithm.</p>
      </ConfigOption>

      <ConfigOption name="optimization.explosions.block-change-threshold" type="Integer" def="512">
        <p>If a single explosion (or WorldEdit operation) attempts to change more than this number of blocks in a single chunk, Pulse will cancel the individual <code>BlockChange</code> packets.</p>
        <p>Instead, it will serialize the chunk section and send it as a whole. This is exponentially faster for the client to render and prevents <code>Timed Out</code> disconnects.</p>
      </ConfigOption>

      <h2 id="compatibility">Plugin Compatibility</h2>

      <ConfigOption name="compatibility.emulate-events" type="Boolean" def="true">
        <p><strong>Do not disable this unless you know what you are doing.</strong></p>
        <p>When enabled, Pulse virtually fires Bukkit and ProtocolLib packet events <em>before</em> placing the packet in the batch buffer. This tricks plugins (like Nexo, GrimAC, or Denizen) into thinking the packet was sent instantly, ensuring 100% plugin compatibility while still maintaining network compression.</p>
      </ConfigOption>

      <ConfigOption name="compatibility.ignored-packets" type="List<String>" def="[]">
        <p>If a specific plugin breaks because of packet batching, you can add the packet class name here to force Pulse to ignore it globally.</p>
      </ConfigOption>
    </div>
  );
}

OptCompatConfig.config = {
  path: "administration/configuration/optimization",
  title: "Optimizations & Compat",
  emoji: "🛡️",
  priority: 3,
  parent: "administration/configuration",
  toc:[
    { id: 'explosions', title: 'Explosion Optimization', level: 2 },
    { id: 'compatibility', title: 'Plugin Compatibility', level: 2 }
  ]
};