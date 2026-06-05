export default function CoreConcepts() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">
      <p className="text-lg">
        Before writing any Corex extension - a tag, a command, an event - you need a solid mental model of three interlocking systems: <strong>Tags</strong>, <strong>Tag Processors</strong>, and <strong>Mechanisms</strong>. Every other API in Corex is built on top of these.
      </p>

      <p>
        Pick a page below based on what you're trying to do:
      </p>

      <ul>
        <li><strong>Tags & Objects</strong> - how data is represented. Start here if you want to create a new type (e.g. a <code>RegionTag</code>, a <code>ShopTag</code>).</li>
        <li><strong>Tag Processors & Attributes</strong> - how <code>{"<tag.sub_tag[param]>"}</code> chains are resolved. Read this before registering any sub-tags.</li>
        <li><strong>Mechanisms</strong> - how tags are mutated immutably via <code>.with[key=value]</code>. Optional unless your tag needs to be adjustable.</li>
        <li><strong>Formatters</strong> - lightweight compile-time tags like <code>{"<n>"}</code> or <code>{"<&char[65]>"}</code>. Simplest extension point in the whole system.</li>
      </ul>
    </div>
  );
}

CoreConcepts.config = {
  path: "developers/core-concepts",
  title: "Core Concepts",
  emoji: "🧠",
  priority: 2,
  toc: [],
};