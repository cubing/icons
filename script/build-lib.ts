import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";
import { FontAssetType, generateFonts, OtherAssetType } from "fantasticon";

const LIB_OUTPUT_DIR = "dist/lib/@cubing/icons";
const OUTPUT_ICONS_CSS = join(LIB_OUTPUT_DIR, "cubing-icons.css");

await mkdir(LIB_OUTPUT_DIR, { recursive: true });

await generateFonts({
  inputDir: "src/svg/",
  outputDir: LIB_OUTPUT_DIR,
  fontTypes: [FontAssetType.WOFF2],
  assetTypes: [OtherAssetType.TS, OtherAssetType.CSS],
  selector: ".cubing-icon",
  name: "cubing-icons",
});

// `fantasticon` does not support a completely empty prefix: https://github.com/tancredi/fantasticon/issues/511
// So we remove the default prefix manually.
const iconsCSSContents = await readFile(OUTPUT_ICONS_CSS, "utf-8");
await writeFile(
  OUTPUT_ICONS_CSS,
  iconsCSSContents
    .replaceAll(".cubing-icon.icon-", ".cubing-icon.")
    .replaceAll(
      ".cubing-icon:before {",
      ".cubing-icon:before {\n  vertical-align: -15%;",
    ),
);

// This places output files in an awkward directory structure, but it keeps our
// transpilation setup as simple as possible. The alternatives come with
// potentially heavy tradeoffs: https://github.com/cubing/icons/issues/146
//
// Also note that `--skipLibCheck` is not ideal, but the easiest way to work
// around https://github.com/oven-sh/bun/issues/8761
await $`bun x tsc \
  --skipLibCheck \
  --declaration \
  --target es2022 \
  --outdir ./dist/lib/@cubing/icons/js \
  ./ts/index.ts`;

console.log(`The library has been built at: ${LIB_OUTPUT_DIR}`);
