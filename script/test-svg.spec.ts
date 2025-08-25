import { expect, test } from "bun:test";
import { basename, dirname } from "node:path";
import { file, Glob } from "bun";
import { JSDOM } from "jsdom";

// Collect into an array so we can iterate over it again multiple times.
const svgFiles = await Array.fromAsync(new Glob("./src/svg/*/*.svg").scan());

test("SVG files are all 500×500", async () => {
  let numSVGs = 0;
  for await (const svgFile of svgFiles) {
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

test("SVG files follow naming conventions", async () => {
  let numSVGs = 0;
  for await (const svgFile of svgFiles) {
    numSVGs++;
    const parentFolder = basename(dirname(svgFile));
    if (parentFolder === "penalty") {
      expect(basename(svgFile)).toMatch(
        /^([A-Z]+\d+([a-z]+\d*)?|\d+[a-z]+(\d+[a-z]*)?)\.svg$/,
      );
    } else {
      expect(basename(svgFile)).toMatch(/^[a-z0-9_]+\.svg$/);
    }
  }

  /**
   * - We could hardcode the number in the test here, but that would require every new SVG contribution to increment the expected value.
   * - We could compare against the built set of icons, but that introduces test dependencies.
   *
   * So instead we just hardcode a reasonable lower bound check.
   */
  expect(numSVGs).toBeGreaterThan(50);
});
