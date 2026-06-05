import { ConfigOption, TipBox } from "@/components/docs/Docs";

export default function Configuration() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        The <code>pulse.yml</code> file is the absolute core of the Pulse engine. It is generated automatically in your server's root directory upon the first launch.
      </p>

      <TipBox title="Hot Reloading">
        Almost all settings in this file can be reloaded without restarting the server. Simply use the <code>/pulse reload</code> command in the console or in-game.
      </TipBox>

      <h2 id="core">Core Settings</h2>
      <p>Master toggles for the engine.</p>

      <ConfigOption name="core.enabled" type="Boolean" def="true">
        <p>The master switch for the Pulse architecture. If set to <code>false</code>, Pulse will bypass all custom Netty pipeline injections, and your server will behave exactly like standard Paper.</p>
        <p>Useful for quick A/B testing or debugging plugin conflicts.</p>
      </ConfigOption>

      <p className="!mt-8">
        <strong>Next Steps:</strong> Dive into the sub-categories below to configure the Batching Engine, Optimizations, and internal Metrics.
      </p>
    </div>
  );
}

Configuration.config = {
  path: "administration/configuration",
  title: "Configuration",
  emoji: "⚙️",
  priority: 1,
  toc:[
    { id: 'core', title: 'Core Settings', level: 2 }
  ]
};