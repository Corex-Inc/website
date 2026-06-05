import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

export default function Formatters() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        Formatters are the simplest extension point in Corex. They are short compile-time tags - things like <code>{"<n>"}</code> for a newline or <code>{"<sp>"}</code> for a space - that get resolved <em>once</em> when the script is loaded, at zero runtime cost.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="implementing">Implementing AbstractFormatter</h2>
      <p>
        A formatter needs a primary name, optional aliases, and a <code>parse()</code> method that returns an <code>AbstractTag</code>:
      </p>

      <DocsCodeBlock lang="java" title="NewlineFormatter - minimal AbstractFormatter" text={`
public class NewlineFormatter implements AbstractFormatter {

    @Override
    public String getName() { return "n"; }

    @Override
    public List<String> getAlias() {
        return List.of("n", "newline", "nl", "&nl");
    }

    @Override
    public AbstractTag parse(Attribute attribute) {
        return new ElementTag("\\n");
    }

    @Override
    public String getTestParam() { return null; } // no param needed
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="with-param">Formatters with Parameters</h2>
      <p>
        Formatters can accept an optional <code>[param]</code> - for example, <code>{"<&char[65]>"}</code> to produce a character from its code point:
      </p>

      <DocsCodeBlock lang="java" title="&char formatter - accepting a param" text={`
@Override
public AbstractTag parse(Attribute attribute) {
    if (!attribute.hasParam()) return new ElementTag("");
    int code = Integer.parseInt(attribute.getParam());
    return new ElementTag(String.valueOf((char) code));
}

@Override
public String getTestParam() { return "65"; } // used by auto-test
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="compile-time">Compile-time Resolution</h2>
      <p>
        When a formatter has no param - or a static, literal param - <code>ScriptCompiler</code> resolves it once at load time and stores it as a <code>CompiledArgument.Static</code>. At runtime, the value is simply read from memory with no processing at all.
      </p>
      <p>
        This makes formatters ideal for frequently used string constants. If your plugin uses a recurring prefix or separator in many scripts, a formatter is cheaper than a tag chain.
      </p>

      <TipBox title="Registration">
        Register formatters via <code>CorexRegistry.register(MyFormatter.class)</code> the same way as any other component. The registry instantiates your formatter and indexes it by all aliases returned from <code>getAlias()</code>.
      </TipBox>

    </div>
  );
}

Formatters.config = {
  path: "developers/core-concepts/formatters",
  title: "Formatters",
  emoji: "✏️",
  priority: 4,
  parent: "developers/core-concepts",
  toc: [
    { id: "implementing", title: "Implementing AbstractFormatter", level: 2 },
    { id: "with-param", title: "Formatters with Parameters", level: 2 },
    { id: "compile-time", title: "Compile-time Resolution", level: 2 },
  ],
};