import { TipBox } from "@/components/docs/Docs";

export default function Migration() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        Pulse is architected as a <b>safe drop-in replacement</b> for Paper and Purpur. 
        Moving your existing production server to Pulse is seamless, takes less than two minutes, and does not require any world conversion or plugin wiping.
      </p>

      <TipBox title="Safety First" type="warning">
        As with any major core change, we strongly advise creating a full backup of your <code>world</code>, <code>world_nether</code>, <code>world_the_end</code> folders, and database before proceeding.
      </TipBox>

      <h2 id="process" className="!text-white">The Migration Process</h2>
      <ol className="list-decimal pl-5 space-y-3 marker:text-gray-500">
        <li><strong>Stop</strong> your current server completely using the <code>stop</code> command. Do not force-kill the process.</li>
        <li><strong>Remove</strong> or rename your existing <code>paper.jar</code> (or <code>purpur.jar</code>).</li>
        <li><strong>Upload</strong> the newly downloaded <code>pulse.jar</code> into the exact same directory.</li>
        <li><strong>Update</strong> your startup script (e.g., <code>start.sh</code> or <code>start.bat</code>) to point to <code>pulse.jar</code> instead of your old core.</li>
        <li><strong>Start</strong> the server. Pulse will automatically detect your existing Paper/Purpur configuration files and load them flawlessly.</li>
      </ol>

      <h2 id="compatibility" className="!text-white">Configuration Compatibility</h2>
      <p>
        You do <strong>not</strong> need to delete or reset your configs. Pulse maintains 100% compatibility with <code>paper-global.yml</code>, <code>paper-world-defaults.yml</code>, and <code>purpur.yml</code> (if applicable).
      </p>
      <p>
        Your current gameplay settings, farm mechanics, redstone timings, and entity limits will remain exactly the same. 
        Pulse only injects a new layer of network efficiency via its own independent <code>pulse.yml</code> file.
      </p>

      <h2 id="downgrading" className="!text-white">Downgrading (Reverting)</h2>
      <p>
        If for any reason you need to switch back to Purpur/Paper, you can do so just as easily. Because Pulse does not alter vanilla chunk saving formats or NBT data structures, you can simply swap the JAR files back. Your world data is perfectly safe.
      </p>
    </div>
  );
}

Migration.config = {
  path: "beginners/getting-started/migration",
  title: "Migration Guide",
  emoji: "🧩",
  parent: "introduction/getting-started",
  priority: 3,
  toc:[
    { id: 'process', title: 'Migration Process', level: 2 },
    { id: 'compatibility', title: 'Compatibility', level: 2 },
    { id: 'downgrading', title: 'Downgrading', level: 2 },
  ]
};