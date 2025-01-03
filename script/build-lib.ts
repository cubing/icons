import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { FontAssetType, OtherAssetType, generateFonts } from "fantasticon";

const LIB_OUTPUT_DIR = "dist/lib/@cubing/icons";
const OUTPUT_ICONS_CSS = join(LIB_OUTPUT_DIR, "cubing-icons.css");

await mkdir(LIB_OUTPUT_DIR, { recursive: true });

await generateFonts({
  inputDir: "src/svg/",
  outputDir: LIB_OUTPUT_DIR,
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF, FontAssetType.WOFF2],
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

console.log(`The library has been built at: ${LIB_OUTPUT_DIR}`);
