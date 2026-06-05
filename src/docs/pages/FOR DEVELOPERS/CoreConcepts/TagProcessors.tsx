import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

export default function TagProcessors() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        A <code>TagProcessor</code> holds every sub-tag handler for a tag class. When the engine resolves <code>{"<shop.name>"}</code>, it calls <code>ShopTag.getAttribute(attr)</code>, which delegates to <code>PROCESSOR.process(this, attr)</code> - and the processor finds the handler registered for <code>"name"</code>.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="registering">Registering Sub-tags</h2>
      <p>
        Sub-tags are registered inside your tag's static <code>register()</code> method. Each registration specifies the return type, the tag name, and a handler lambda:
      </p>

      <DocsCodeBlock lang="java" title="Registering sub-tags on a TagProcessor" text={`
public static void register() {

    // Simple: returns a plain value
    TAG_PROCESSOR.registerTag(ElementTag.class, "name", (attr, obj) ->
        new ElementTag(obj.getName()));

    // With a plain string param: <shop.discount[vip]>
    TAG_PROCESSOR.registerTag(ElementTag.class, "discount", (attr, obj) -> {
        if (!attr.hasParam()) return null;
        return new ElementTag(obj.getDiscount(attr.getParam()));
    });

    // With a typed tag param: <shop.nearest[l@world,0,64,0]>
    TAG_PROCESSOR.registerTag(ShopTag.class, "nearest", (attr, obj) -> {
        LocationTag loc = attr.getParamObject(LocationTag.class, LocationTag::new);
        if (loc == null) return null;
        return ShopRegistry.findNearest(loc);
    });
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="attribute">Reading Params with Attribute</h2>
      <p>
        The <code>Attribute</code> object represents the engine's current position in a tag chain. It gives you access to the current segment name, its optional <code>[param]</code>, and a lookahead into the next segment.
      </p>

      <div className="!not-prose !overflow-x-auto !my-6">
        <table className="!w-full !text-sm !border-collapse">
          <thead>
            <tr className="!border-b !border-gray-800">
              <th className="!text-left !py-2 !pr-4 !text-gray-400 !font-medium">Method</th>
              <th className="!text-left !py-2 !pr-4 !text-gray-400 !font-medium">Returns</th>
              <th className="!text-left !py-2 !text-gray-400 !font-medium">Use when</th>
            </tr>
          </thead>
          <tbody className="!text-gray-300">
            {[
              ["attr.hasParam()", "boolean", "Check before reading any param"],
              ["attr.getParam()", "String", "You only need a plain string (name, key, format)"],
              ["attr.getParamObject()", "AbstractTag", "You need the raw tag, no type conversion"],
              ["attr.getParamObject(Type.class)", "Type or null", "You need a specific type, already resolved"],
              ["attr.getParamObject(Type.class, Type::new)", "Type or null", "Tag may arrive as a bare ElementTag string - safest form"],
            ].map(([method, ret, note]) => (
              <tr key={method} className="!border-b !border-gray-800/50">
                <td className="!py-2 !pr-4 !font-mono !text-xs !text-yellow-300 !whitespace-nowrap">{method}</td>
                <td className="!py-2 !pr-4 !font-mono !text-xs !text-green-300 !whitespace-nowrap">{ret}</td>
                <td className="!py-2 !text-gray-400 !text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TipBox title="Always prefer the two-argument form">
        <code>getParamObject(LocationTag.class, LocationTag::new)</code> is the only variant that handles both a pre-resolved tag <em>and</em> a bare string value. If you omit the constructor, a plain string passed by a script user will silently return <code>null</code>.
        <br /><br />
        The second argument is always the <strong>String constructor</strong> (<code>ClassName::new</code>). Never pass a static factory.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="lookahead">Lookahead - Consuming Two Segments</h2>
      <p>
        Some tags naturally read two segments in one handler, like <code>{"<list.get[1].to[3]>"}</code>. Use the lookahead API to peek at the next segment and then call <code>attr.fulfill(1)</code> to advance past it:
      </p>

      <DocsCodeBlock lang="java" title="Lookahead: consuming .get[n].to[n] in one handler" text={`
TAG_PROCESSOR.registerTag(ListTag.class, "get", (attr, obj) -> {
    int from = Integer.parseInt(attr.getParam());
    int to   = from; // default: single element

    if (attr.matchesNext("to") && attr.hasNextParam()) {
        to = Integer.parseInt(attr.getNextParam());
        attr.fulfill(1); // consumed .to[n] - skip it
    }

    return obj.subList(from, to);
});
`} />

      <TipBox title="fulfill(1) only for lookahead" type="warning">
        Your handler already consumed the <em>current</em> segment automatically. Only call <code>attr.fulfill(1)</code> if you also consumed the <em>next</em> segment via lookahead. Calling it without lookahead skips a segment.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="version">Version Constraints</h2>
      <p>
        Sub-tags can be gated to specific server versions with a fluent API on the registration result:
      </p>

      <DocsCodeBlock lang="java" title="Version-gating sub-tags" text={`
// Only available on 1.21.4 and above
TAG_PROCESSOR.registerTag(ElementTag.class, "custom_model_data", (attr, obj) -> ...)
         .setAvailableSince("1.21.4");

// Only available below 1.21.4
TAG_PROCESSOR.registerTag(ElementTag.class, "legacy_color", (attr, obj) -> ...)
         .setAvailableBefore("1.21.4");
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="testing">Auto-testing</h2>
      <p>
        Corex has a built-in auto-test framework that runs all registered sub-tags using <code>getTestValue()</code> as input. You can hook into it per-tag:
      </p>

      <DocsCodeBlock lang="java" title="Attaching auto-tests to tag registrations" text={`
// Run auto-test: resolve "get[1]"
TAG_PROCESSOR.registerTag(AbstractTag.class, "get", (attr, obj) -> ...)
         .test("1");

// Resolve "get[1]" with chained tag "to[3]"
TAG_PROCESSOR.registerTag(ElementTag.class, "name", (attr, obj) -> ...)
         .test("1", "to[3]");

// Skip a tag from auto-testing (e.g. requires live server state)
TAG_PROCESSOR.registerTag(ElementTag.class, "online_players", (attr, obj) -> ...)
         .ignoreTest();
`} />

    </div>
  );
}

TagProcessors.config = {
  path: "developers/core-concepts/processors",
  title: "Tag Processors & Attributes",
  emoji: "⛓️",
  priority: 2,
  parent: "developers/core-concepts",
  toc: [
    { id: "registering", title: "Registering Sub-tags", level: 2 },
    { id: "attribute", title: "Reading Params with Attribute", level: 2 },
    { id: "lookahead", title: "Lookahead", level: 2 },
    { id: "version", title: "Version Constraints", level: 2 },
    { id: "testing", title: "Auto-testing", level: 2 },
  ],
};