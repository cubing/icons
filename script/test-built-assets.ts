import { default as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import {
  CUBING_ICONS_CODEPOINTS,
  CubingIcons,
  type CubingIconsClassName,
  type CubingIconsKey,
} from "../dist/lib/@cubing/icons/js";

const official: CubingIconsClassName = "event-fto";
const legacy: CubingIconsClassName = "unofficial-fto";
const officialKey: CubingIconsKey = "EventFto";
const legacyKey: CubingIconsKey = "UnofficialFto";
assert.equal(CubingIcons[officialKey], official);
assert.equal(CubingIcons[legacyKey], legacy);

const css = await readFile("dist/lib/@cubing/icons/cubing-icons.css", "utf8");
const cssDOM = new JSDOM(`<style>${css}</style>`);
const rules = Array.from(cssDOM.window.document.styleSheets[0].cssRules);
function cssCodepoint(className: string): number {
  const rule = rules.find(
    (rule): rule is CSSStyleRule =>
      "selectorText" in rule &&
      (rule as CSSStyleRule).selectorText
        .split(",")
        .some(
          (selector) => selector.trim() === `.cubing-icon.${className}:before`,
        ),
  );
  assert(rule, `Missing CSS rule for ${className}`);
  const match = /^"\\([0-9a-f]+)"$/i.exec(
    rule.style.getPropertyValue("content"),
  );
  assert(match, `Missing glyph for ${className}`);
  return Number.parseInt(match[1], 16);
}
for (const className of [official, legacy]) {
  assert.equal(
    cssCodepoint(className),
    Number(CUBING_ICONS_CODEPOINTS[className]),
  );
}
assert.equal(cssCodepoint("event-unofficial-fto"), cssCodepoint(official));
assert.equal(
  await readFile("src/svg/event/fto.svg", "utf8"),
  await readFile("src/svg/unofficial/fto.svg", "utf8"),
);

const { document } = new JSDOM(
  await readFile("dist/web/icons.cubing.net/index.html", "utf8"),
).window;
assert(document.querySelector("#wca-events #event-fto"));
assert(document.querySelector("#unofficial-events #unofficial-fto"));
assert(document.querySelector(".sample.output .event-fto"));
const events = Array.from(
  document.querySelectorAll("#wca-events .icons-list > li"),
  (li) => li.id,
);
assert(events.indexOf(official) < events.indexOf("event-333ft"));
console.log("FTO metadata, CSS compatibility, shared artwork, and catalog: OK");
