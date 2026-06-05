import { ConfigOption } from "@/components/docs/Docs";

export default function MetricsConfig() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        Pulse includes a built-in profiler modeled after tools like Spark, accessible via <code>/pulse stats</code>.
      </p>

      <ConfigOption name="metrics.enabled" type="Boolean" def="true">
        <p>Toggles the entire metrics collection system. The overhead is virtually zero, relying on atomic counters.</p>
      </ConfigOption>

      <ConfigOption name="metrics.update-interval" type="Integer" def="1">
        <p>How often (in seconds) the rolling averages are recalculated. On extremely heavy servers (like 2b2t clones), you can increase this to <code>5</code> or <code>10</code> to save a few CPU cycles.</p>
      </ConfigOption>

      <h2 id="modules">Modules</h2>
      <p>You can selectively disable specific metric calculations.</p>

      <ConfigOption name="metrics.modules.network" type="Boolean" def="true">
        <p>Tracks Logical vs Physical packets and calculates compression efficiency.</p>
      </ConfigOption>
      
      <ConfigOption name="metrics.modules.cpu-estimation" type="Boolean" def="true">
        <p>The most advanced metric. It mathematically calculates the 'Vanilla Estimate' CPU load by evaluating the cost of syscalls saved by the batching engine.</p>
      </ConfigOption>

      <ConfigOption name="metrics.modules.memory-impact" type="Boolean" def="true">
        <p>Estimates the amount of RAM (allocations) saved from reaching the Garbage Collector.</p>
      </ConfigOption>

    </div>
  );
}

MetricsConfig.config = {
  path: "administration/configuration/metrics",
  title: "Metrics System",
  emoji: "📊",
  priority: 4,
  parent: "administration/configuration",
  toc: [
    { id: 'modules', title: 'Modules', level: 2 }
  ]
};