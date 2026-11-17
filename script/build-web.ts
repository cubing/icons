import { default as assert } from "node:assert";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { deprecatedIcons } from "../src/js/deprecated";

// Note that the imported file path must be an inline string to allow for type
// checking, so we don't use `join(TEMP_LIB_OUTPUT_DIR, …)` to deduplicate the
// folder path.
const { CubingIcons } = await import("../dist/lib/@cubing/icons/js");

const SITE_OUTPUT_DIR = "./dist/web/icons.cubing.net";
const SITE_SRC_DIR = "./src/web/icons.cubing.net";
const HTML_INDEX_FILENAME = "index.html";

const LIB_OUTPUT_DIR = "./dist/lib";

await rm(SITE_OUTPUT_DIR, { force: true, recursive: true });
await mkdir(SITE_OUTPUT_DIR, { recursive: true });

const indexSource = await readFile(
  join(SITE_SRC_DIR, HTML_INDEX_FILENAME),
  "utf-8",
);

const dom = new JSDOM(indexSource);

const { document } = dom.window;

function mustExist<T>(t: T | null): NonNullable<T> {
  if (!t) {
    throw new Error("Missing element");
  }
  return t;
}

// Sort all current WCA events in the same order as the WCA website (ahead of former events).
// We'd import this from `cubing.js`, but: https://github.com/cubing/cubing.js/issues/351
const wcaEventOrdering = [
  "333",
  "222",
  "444",
  "555",
  "666",
  "777",
  "333bf",
  "333fm",
  "333oh",
  "clock",
  "minx",
  "pyram",
  "skewb",
  "sq1",
  "444bf",
  "555bf",
  "333mbf",
  "fto",
];

function validateClassName(className: string) {
  if (!className.match(/[a-zA-Z0-9-]+/)) {
    throw new Error("Unexpected class name.");
  }
}

const GROUP_NAMES = ["event", "unofficial", "penalty", "deprecated"] as const;
function toGroupName(className: string): (typeof GROUP_NAMES)[number] {
  if (deprecatedIcons[className]) {
    return "deprecated";
  }
  for (const groupName of GROUP_NAMES) {
    if (className.startsWith(`${groupName}-`)) {
      return groupName;
    }
  }
  throw new Error("Invalid group name.");
}

const classNamesOrdered: Record<(typeof GROUP_NAMES)[number], string[]> = {
  event: wcaEventOrdering.map((eventID) => `event-${eventID}`),
  unofficial: [],
  penalty: [],
  deprecated: [],
};
for (const className of Object.values(CubingIcons).sort()) {
  validateClassName(className);
  const groupNamesOrdered = classNamesOrdered[toGroupName(className)];
  if (!groupNamesOrdered.includes(className)) {
    groupNamesOrdered.push(className);
  }
}

const undeprecatedClassNamesOrdered: string[] = [
  ...classNamesOrdered.event,
  ...classNamesOrdered.unofficial,
  ...classNamesOrdered.penalty,
];
const allIconsElem = mustExist(document.querySelector("#all-icons"));
allIconsElem.textContent = "";
for (const className of undeprecatedClassNamesOrdered) {
  const a = allIconsElem.appendChild(document.createElement("a"));
  a.href = `#${className}`;
  const span = a.appendChild(document.createElement("span"));
  span.classList.add("cubing-icon");
  span.classList.add(className);
}

const notices = document.querySelectorAll(".source-notice");
assert.equal(notices.length, 2);
for (const notice of notices) {
  notice.remove();
}

function getGroupIconsList(prefix: string): Element {
  const [elem, ...extra] = document.getElementsByClassName(`group-${prefix}`);
  if (!elem || extra.length > 0) {
    throw new Error("Unexpected number of elems.");
  }
  const iconsList = mustExist(elem.querySelector("ul.icons-list"));
  iconsList.textContent = ""; // Clear all children.
  return iconsList;
}

/**
 * Automatically adds a deprecation message depending on `className`.
 */
function addIconChip(iconsList: Element, className: string) {
  console.log(className);
  const li = iconsList.appendChild(document.createElement("li"));
  li.id = className;
  const a = li.appendChild(document.createElement("a"));
  a.href = `#${className}`;
  {
    const div = a.appendChild(document.createElement("div"));
    const span = div.appendChild(document.createElement("span"));
    span.classList.add("cubing-icon");
    span.classList.add(className);
    const codeElem = div.appendChild(document.createElement("code"));
    codeElem.append(`cubing-icon ${className}`);
  }
  const deprecation = deprecatedIcons[className];
  if (deprecation) {
    const div = a.appendChild(document.createElement("div"));
    const span = div.appendChild(document.createElement("span"));
    span.textContent = "Replaced with: ";
    const codeElem = div.appendChild(document.createElement("code"));
    codeElem.classList.add("replacement");

    const { replacement } = deprecation;
    if (!replacement) {
      throw new Error(
        "So far, we only handle deprecated icons with replacements.",
      );
    }
    codeElem.append(`cubing-icon ${replacement}`);
  }
}

for (const groupName of GROUP_NAMES) {
  const iconsList = getGroupIconsList(groupName);
  for (const className of classNamesOrdered[groupName]) {
    addIconChip(iconsList, className);
  }
}

mustExist(
  document.querySelector<HTMLLinkElement>("head #cubing-icons-css-link"),
).href = "./@cubing/icons/cubing-icons.css";

// Copy all files.
await cp(join(SITE_SRC_DIR), join(SITE_OUTPUT_DIR), { recursive: true });

// Overwrite HTML file.
await writeFile(join(SITE_OUTPUT_DIR, HTML_INDEX_FILENAME), dom.serialize());

// Vendor lib.
// TODO: semantics don't match `cp` binary???
await cp(LIB_OUTPUT_DIR, SITE_OUTPUT_DIR, {
  recursive: true,
});

console.log(`The web site has been built at: ${SITE_OUTPUT_DIR}`);
