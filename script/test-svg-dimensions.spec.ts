import { expect, test } from "bun:test";
import { file, Glob } from "bun";
import { JSDOM } from "jsdom";

test("SVG files are all 500×500", async () => {
  let numSVGs = 0;
  for await (const svgFile of new Glob("./src/svg/*/*.svg").scan()) {
    numSVGs++;
    const svgElem = new JSDOM(
      await file(svgFile).text(),
    ).window.document.querySelector("svg");
    expect(svgElem).not.toBeNull();
    expect(svgElem?.getAttribute("width")).toEqual("500");
    expect(svgElem?.getAttribute("height")).toEqual("500");
  }

  /**
   * - We could hardcode the number in the test here, but that would require every new SVG contribution to increment the expected value.
   * - We could compare against the built set of icons, but that introduces test dependencies.
   *
   * So instead we just hardcode a reasonable lower bound check.
   */
  expect(numSVGs).toBeGreaterThan(50);
});
