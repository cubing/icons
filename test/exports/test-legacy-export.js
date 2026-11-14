import { default as assert } from "node:assert";
import { CubingIcons } from "../../js/index.js";

assert(typeof CubingIcons === "object");
assert.equal(CubingIcons.EventFto, "event-fto");
assert.equal(CubingIcons.UnofficialFto, "unofficial-fto");
console.log("OK");
