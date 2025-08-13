import { default as assert } from "node:assert";

let capturedConsoleErrorMessage: string | undefined;
console.error = (s) => {
  capturedConsoleErrorMessage = s;
};

// This must be a dynamic import to avoid being hoisted above the `console.error` modification.
const { CubingIcons } = await import("../../ts");

assert(typeof CubingIcons === "object");
assert.equal(
  capturedConsoleErrorMessage,
  "Using `@cubing/icons/ts` is deprecated. Please use `@cubing/icons/js` for the same functionality.",
);
console.log("OK");
