import { expect, test } from "bun:test";
import { basename, dirname } from "node:path";
import { file, Glob } from "bun";
import { JSDOM } from "jsdom";

// Collect into an array so we can iterate over it again multiple times.
const svgFiles = await Array.fromAsync(new Glob("./src/svg/*/*.svg").scan());

/**
 * Helper so TypeScript can infer `expect(...).not.toBeNull()`.
 */
function expectNotNull<T>(
  value: T | null,
  message: string,
): asserts value is T {
  expect(value, message).not.toBeNull();
}

test.concurrent("SVG files are all 500×500", async () => {
  let numSVGs = 0;
  for await (const svgFile of svgFiles) {
    numSVGs++;
    const svgElem = new JSDOM(
      await file(svgFile).text(),
    ).window.document.querySelector("svg");
    expectNotNull(svgElem, `${svgFile}: no svg`);
    expect(svgElem?.getAttribute("width"), `${svgFile}: wrong width`).toEqual(
      "500",
    );
    expect(svgElem?.getAttribute("height"), `${svgFile}: wrong height`).toEqual(
      "500",
    );
    expect(
      svgElem?.getAttribute("viewBox"),
      `${svgFile}: wrong viewBox`,
    ).toEqual("0 0 500 500");
  }

  /**
   * - We could hardcode the number in the test here, but that would require every new SVG contribution to increment the expected value.
   * - We could compare against the built set of icons, but that introduces test dependencies.
   *
   * So instead we just hardcode a reasonable lower bound check.
   */
  expect(numSVGs).toBeGreaterThan(50);
});

test.concurrent("SVG files follow naming conventions", async () => {
  let numSVGs = 0;
  for await (const svgFile of svgFiles) {
    numSVGs++;
    const parentFolder = basename(dirname(svgFile));
    if (parentFolder === "penalty") {
      expect(basename(svgFile), `${svgFile}: wrong basename`).toMatch(
        /^([A-Z]+\d+([a-z]+\d*)?|\d+[a-z]+(\d+[a-z]*)?)\.svg$/,
      );
    } else {
      expect(basename(svgFile), `${svgFile}: wrong basename`).toMatch(
        /^[a-z0-9_]+\.svg$/,
      );
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

test.concurrent("SVGs have no hardcoded colors", async () => {
  for await (const svgFile of svgFiles) {
    function checkElement(el: SVGElement) {
      expect(el.getAttribute("fill"), `${svgFile}: has fill color`).toBeNull();
      expect(
        el.getAttribute("stroke"),
        `${svgFile}: has stroke color`,
      ).toBeNull();
      expect(
        el.style.getPropertyValue("fill"),
        `${svgFile}: has inline fill color`,
      ).toBe("");
      expect(
        el.style.getPropertyValue("stroke"),
        `${svgFile}: has inline stroke color`,
      ).toBe("");

      for (const child of el.children) {
        checkElement(child as SVGElement);
      }
    }

    const svgElem = new JSDOM(
      await file(svgFile).text(),
    ).window.document.querySelector("svg");

    expectNotNull(svgElem, `${svgFile}: no svg`);
    checkElement(svgElem);
  }
});

test.concurrent("SVGs are well-formed with no extraneous attributes", async () => {
  for await (const svgFile of svgFiles) {
    const svgElem = new JSDOM(
      await file(svgFile).text(),
    ).window.document.querySelector("svg");

    expectNotNull(svgElem, `${svgFile}: no svg`);
    expect(svgElem.getAttribute("xmlns"), `${svgFile}: bad xmlns`).toBe(
      "http://www.w3.org/2000/svg",
    );
    expect(
      svgElem.getAttributeNames().sort(),
      `${svgFile}: wrong attributes`,
    ).toEqual(["width", "height", "viewBox", "xmlns"].sort());
  }
});

const ALLOWED_ELEMENTS = ["svg", "g", "path", "circle", "defs"];

test.concurrent("SVGs only have allowed elements", async () => {
  for await (const svgFile of svgFiles) {
    function checkElement(el: Element) {
      expect(el.tagName, `${svgFile}: disallowed element`).toBeOneOf(
        ALLOWED_ELEMENTS,
      );

      for (const child of el.children) {
        checkElement(child as Element);
      }
    }

    const svgElem = new JSDOM(
      await file(svgFile).text(),
    ).window.document.querySelector("svg");

    expectNotNull(svgElem, `${svgFile}: no svg`);
    checkElement(svgElem);
  }
});
