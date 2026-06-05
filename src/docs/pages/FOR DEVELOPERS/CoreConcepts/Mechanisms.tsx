import { TipBox } from "@/components/docs/Docs";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

export default function Mechanisms() {
  return (
    <div className="space-y-6 text-gray-300 prose prose-invert max-w-none">

      <p className="text-lg">
        Mechanisms are the write side of the tag system. While sub-tags <em>read</em> data from an object, mechanisms <em>modify</em> it - immutably, always returning a new copy. They power the <code>.with[key=value]</code> global tag and the <code>adjust</code> command.
      </p>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="adjustable">Making a Tag Adjustable</h2>
      <p>
        Add <code>Adjustable</code> to your tag's <code>implements</code> clause and provide three things: a <code>MechanismProcessor</code> instance, a <code>duplicate()</code> method, and the <code>applyMechanism</code> bridge:
      </p>

      <DocsCodeBlock lang="java" title="ShopTag - implementing Adjustable" text={`
public class ShopTag implements AbstractTag, Adjustable {

    public static final MechanismProcessor<ShopTag> MECHANISMS = new MechanismProcessor<>();

    @Override
    public Adjustable duplicate() {
        return new ShopTag(this.id, this.name, this.discount); // deep copy
    }

    @Override
    public AbstractTag applyMechanism(String mechanism, AbstractTag value) {
        return MECHANISMS.process(this, mechanism, value);
    }

    @Override
    public MechanismProcessor<? extends AbstractTag> getMechanismProcessor() {
        return MECHANISMS;
    }
}
`} />

      <hr className="!border-gray-800 !my-8" />

      <h2 id="registering">Registering Mechanisms</h2>
      <p>
        Mechanisms are registered inside <code>register()</code>, same as sub-tags. The handler receives the <em>original</em> object and the value being set - it must return a modified copy:
      </p>

      <DocsCodeBlock lang="java" title="Registering mechanisms on MechanismProcessor" text={`
public static void register() {

    // Set the shop's display name
    MECHANISMS.registerMechanism("name", (obj, val) -> {
        ShopTag copy = (ShopTag) obj.duplicate();
        copy.setName(val.identify());
        return copy;
    });

    // Set discount - validate that it's a valid number first
    MECHANISMS.registerMechanism("discount", (obj, val) -> {
        if (!(val instanceof ElementTag el) || !el.isDouble()) return obj;
        ShopTag copy = (ShopTag) obj.duplicate();
        copy.setDiscount(el.asDouble());
        return copy;
    });
}
`} />

      <TipBox title="Never mutate the original">
        Mechanisms must always return a <strong>new copy</strong> via <code>duplicate()</code>. Mutating <code>obj</code> directly will corrupt any other script holding a reference to the same tag.
        <br /><br />
        <code>duplicate()</code> must be a true deep copy of all mutable fields. Shallow copies will cause subtle aliasing bugs.
      </TipBox>

      <hr className="!border-gray-800 !my-8" />

      <h2 id="usage">How Scripts Use Mechanisms</h2>
      <p>
        Once registered, mechanisms are available in two ways from scripts:
      </p>

      <DocsCodeBlock lang="corex" title="Using mechanisms from a .cx script" text={`
# Via the global .with[] tag - returns a modified copy inline
- def myShop <shop[market_east].with[name=Grand Market|discount=0.2]>

# Via the adjust command - modifies a def in-place
- adjust <def[myShop]> name:Grand Market
`} />

      <p>
        The <code>.with[...]</code> syntax accepts a pipe-separated <code>key=value</code> map. Each pair is matched to a registered mechanism name and applied sequentially on a copy.
      </p>

    </div>
  );
}

Mechanisms.config = {
  path: "developers/core-concepts/mechanisms",
  title: "Mechanisms",
  emoji: "🔧",
  priority: 3,
  parent: "developers/core-concepts",
  toc: [
    { id: "adjustable", title: "Making a Tag Adjustable", level: 2 },
    { id: "registering", title: "Registering Mechanisms", level: 2 },
    { id: "usage", title: "How Scripts Use Mechanisms", level: 2 },
  ],
};