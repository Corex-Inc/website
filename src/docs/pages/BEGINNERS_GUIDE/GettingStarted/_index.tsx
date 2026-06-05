import { TipBox, TextLink } from "@/components/docs/Docs";

export default function GettingStarted() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        Welcome to the Pulse ecosystem. Setting up your high-performance server takes only a few minutes.
      </p>

      <h2 id="requirements" className="!text-white">System Requirements</h2>
      <ul className="space-y-1">
        <li><strong>Java:</strong> Java 21 or newer <span className="text-gray-500">(Temurin or GraalVM recommended)</span>.</li>
        <li><strong>OS:</strong> Linux <span className="text-gray-500">(Ubuntu/Debian highly recommended for production)</span>, Windows, or macOS.</li>
        <li><strong>Memory:</strong> Minimum 2GB RAM allocated <span className="text-gray-500">(4GB+ recommended for high player counts)</span>.</li>
      </ul>

      <TipBox title="Java 21 Requirement" type="warning">
        Pulse relies on modern Java features for optimal memory and thread management. Attempting to run Pulse on Java 17 or older will result in a crash.
      </TipBox>

      <h2 id="installation" className="!text-white">Installation</h2>
      <ol className="list-decimal pl-5 space-y-4 marker:text-gray-500">
        <li>
          Download the latest <code>pulse.jar</code> from our 
          <TextLink href="/releases"> Downloads Page </TextLink>.
        </li>
        <li>Place the JAR file in a new, empty directory dedicated to your server.</li>
        <li>
          Continue following the instructions in
          <TextLink href="https://docs.papermc.io/paper/getting-started/#running-the-server" inNewTab > Paper's guide </TextLink>.
        </li>
      </ol>

      <h2 id="first-launch" className="!text-white">First Launch</h2>
      <p>
        Upon the first successful launch, Pulse will generate the <code>pulse.yml</code> configuration file in your root directory. 
      </p>
      <p>
        Once you join the game, you can run <code>/pulse stats</code> to instantly verify that the Smart Batching engine is active and intercepting traffic!
      </p>
    </div>
  );
}

GettingStarted.config = {
  path: "beginners/getting-started",
  title: "Getting Started",
  emoji: "✨",
  priority: 2,
  toc:[
    { id: 'requirements', title: 'Requirements', level: 2 },
    { id: 'installation', title: 'Installation', level: 2 },
    { id: 'first-launch', title: 'First Launch', level: 2 },
  ]
};