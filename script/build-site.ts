import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { JSDOM } from "jsdom";

const { CubingIcons } = await import(
  "../dist/lib/@cubing/icons/cubing-icons.ts"
);

const SITE_OUTPUT_DIR = "./dist/web/icons.cubing.net";
const SITE_SRC_DIR = "./src/web/icons.cubing.net";
const HTML_INDEX_FILENAME = "index.html";
const CSS_INDEX_FILENAME = "index.css";

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
];
const classNamesOrdered = wcaEventOrdering.map((eventID) => `event-${eventID}`);
for (const className of Object.values(CubingIcons).sort()) {
  if (!classNamesOrdered.includes(className)) {
    classNamesOrdered.push(className);
  }
}

mustExist(document.querySelector("#source-notice")).remove();
for (const prefix of ["event", "unofficial", "penalty"]) {
  const [elem, ...extra] = document.getElementsByClassName(`group-${prefix}`);
  if (!elem || extra.length > 0) {
    throw new Error("Unexpected number of elems.");
  }
  const iconsList = mustExist(elem.querySelector("ul.icons-list"));
  iconsList.textContent = ""; // Clear all children.

  for (const className of classNamesOrdered) {
    if (className.startsWith(`${prefix}-`)) {
      if (!className.match(/[a-zA-Z0-9\-]+/)) {
        throw new Error("Unexpected class name.");
      }
      console.log(className);
      const li = iconsList.appendChild(document.createElement("li"));
      li.id = className;
      const a = li.appendChild(document.createElement("a"));
      a.href = `#${className}`;
      const span = a.appendChild(document.createElement("span"));
      span.classList.add("cubing-icon");
      span.classList.add(className);
      const codeElem = a.appendChild(document.createElement("code"));
      codeElem.append(`cubing-icon ${className}`);
    }
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
