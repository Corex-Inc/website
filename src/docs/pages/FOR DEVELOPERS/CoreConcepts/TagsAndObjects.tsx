import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

export default function TagsAndObjects() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        In Corex, every value is an <code>AbstractTag</code>. A player, a location, a number, a list - all tags. They are the universal currency of the scripting engine: commands receive them, return them, store them in flags, and pass them between queues.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="identity">Identity Strings</h2>
      <p>
        Every tag has a canonical string representation produced by <code>identify()</code>. The convention is <code>prefix@data</code>:
      </p>

      <DocsCodeBlock lang="java" title="Examples of identify() output" text={`
"p@069a7b4e-3421-..."   // PlayerTag
"l@world,0,64,0"        // LocationTag
"li@item1|item2"        // ListTag
"42"                    // ElementTag - plain values have no prefix
`} />

      <p>
        This string is how tags survive serialization - flags, <code>def</code> values, and cross-queue passing all store the <code>identify()</code> string and later reconstruct the tag via <code>ObjectFetcher</code>.
      </p>

      <TipBox title="Critical rule">
        <code>identify()</code> must be stable and reproducible. If you store <code>my@hello</code>, you must be able to reconstruct the original tag from the string <code>"hello"</code> alone. Never include runtime-only state in <code>identify()</code>.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="implementing">Implementing AbstractTag</h2>
      <p>
        A minimal tag requires five methods and one static processor instance:
      </p>

      <DocsCodeBlock lang="java" title="ShopTag - minimal AbstractTag implementation" text={`
public class ShopTag implements AbstractTag {

    private final String id;

    public ShopTag(String id) { this.id = id; }

    @Override
    public String identify() {
        return "shop@" + id;  // e.g. "shop@market_east"
    }

    @Override
    public String getPrefix() { return "shop"; }

    @Override
    public AbstractTag getAttribute(Attribute attribute) {
        return PROCESSOR.process(this, attribute);
    }

    @Override
    public String getTestValue() { return "shop@market_east"; }

    @Override
    public TagProcessor<? extends AbstractTag> getProcessor() {
        return PROCESSOR;
    }

    public static final TagProcessor<ShopTag> PROCESSOR = new TagProcessor<>();

    public static void register() {
        // sub-tags registered here - see Tag Processors page
        ObjectFetcher.registerFetcher("shop", s -> s != null ? new ShopTag(s) : null);
    }
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="objectfetcher">ObjectFetcher</h2>
      <p>
        <code>ObjectFetcher</code> is the engine's central deserializer. Given a string like <code>"shop@market_east"</code>, it splits on <code>@</code>, finds the registered fetcher for <code>"shop"</code>, and calls it with <code>"market_east"</code>.
      </p>
      <p>You register your fetcher inside <code>register()</code>:</p>

      <DocsCodeBlock lang="java" title="Registering an ObjectFetcher" text={`
// s = everything after "shop@"
ObjectFetcher.registerFetcher("shop", s -> {
    if (s == null || s.isEmpty()) return null;
    return new ShopTag(s); // or null if the shop doesn't exist
});
`} />

      <p>
        If the fetcher returns <code>null</code>, <code>ObjectFetcher.pickObject()</code> falls back to wrapping the raw string in an <code>ElementTag</code>. If no prefix is found at all, the whole string becomes an <code>ElementTag</code>.
      </p>

      <TipBox title="Splitting nested structures" type="warning">
        Never use <code>String.split(",")</code> on tag params - a <code>LocationTag</code> param like <code>l@world,0,64,0</code> contains commas. Use <code>ObjectFetcher.splitIgnoringBrackets(str, ',')</code> instead, which is bracket-aware and won't split inside <code>[...]</code>.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="base-tags">Base Tag Registration</h2>
      <p>
        A base tag is the root of a chain - the <code>player</code> in <code>{"<player.name>"}</code> or <code>element</code> in <code>{"<element[hello]>"}</code>. Register them via <code>BaseTagProcessor</code> inside your <code>register()</code> method:
      </p>

      <DocsCodeBlock lang="java" title="Registering base tags" text={`
// Resolved from queue context (e.g. the linked player)
BaseTagProcessor.registerBaseTag("player", attr -> {
    ScriptQueue queue = attr.getQueue();
    if (queue == null) return null;
    return queue.getPlayer();
});

// Constructed from param: <shop[market_east]>
BaseTagProcessor.registerBaseTag("shop", attr ->
    attr.hasParam() ? new ShopTag(attr.getParam()) : null
);
`} />

      <TipBox title="Don't call fulfill() in base tag lambdas">
        <code>BaseTagProcessor.executeBaseTag()</code> calls <code>attr.fulfill(1)</code> automatically after your lambda returns. Calling it yourself will double-advance the cursor and skip the next sub-tag.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="globalflags">Global Tags</h2>
      <p>
        The <code>GlobalTagProcessor</code> provides tags available on <em>every</em> <code>AbstractTag</code> automatically - no extra code needed in your class. Built-ins include:
      </p>

      <div className="!not-prose !overflow-x-auto">
        <table className="!w-full !text-sm !border-collapse">
          <thead>
            <tr className="!border-b !border-gray-800">
              <th className="!text-left !py-2 !pr-4 !text-gray-400 !font-medium">Tag</th>
              <th className="!text-left !py-2 !pr-4 !text-gray-400 !font-medium">Returns</th>
              <th className="!text-left !py-2 !text-gray-400 !font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="!text-gray-300">
            {[
              [".prefix", "ElementTag", "The prefix string of the object"],
              [".exists", 'ElementTag("true")', "Always true if the tag resolved"],
              [".as[type]", "AbstractTag", "Force-cast via ObjectFetcher"],
              [".with[map]", "Adjustable", "Apply mechanisms from a MapTag"],
              [".flag[name]", "AbstractTag", "Get flag value (requires Flaggable)"],
              [".hasFlag[name]", "ElementTag", "Boolean flag existence check"],
            ].map(([tag, ret, note]) => (
              <tr key={tag} className="!border-b !border-gray-800/50">
                <td className="!py-2 !pr-4 !font-mono !text-xs !text-yellow-300">{tag}</td>
                <td className="!py-2 !pr-4 !font-mono !text-xs !text-green-300">{ret}</td>
                <td className="!py-2 !text-gray-400 !text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="!mt-4">
        To add your own global tag (available on every object engine-wide), register it inside <code>GlobalTagProcessor.register()</code> using the same <code>registerTag()</code> API as a normal processor.
      </p>
      <p>
        If you want to <em>disable</em> global tag fallthrough for a specific tag class (e.g. a sealed internal type), call <code>.disableGlobalTags()</code> when constructing the processor:
      </p>

      <DocsCodeBlock lang="java" title="Disabling global tags for a specific processor" text={`
public static final TagProcessor<ShopTag> PROCESSOR =
    new TagProcessor<>().disableGlobalTags();
`} />

    </div>
  );
}

TagsAndObjects.config = {
  path: "developers/core-concepts/tags",
  title: "Tags & Objects",
  emoji: "🏷️",
  priority: 1,
  parent: "developers/core-concepts",
  toc: [
    { id: "identity", title: "Identity Strings", level: 2 },
    { id: "implementing", title: "Implementing AbstractTag", level: 2 },
    { id: "objectfetcher", title: "ObjectFetcher", level: 2 },
    { id: "base-tags", title: "Base Tag Registration", level: 2 },
    { id: "globalflags", title: "Global Tags", level: 2 },
  ],
};