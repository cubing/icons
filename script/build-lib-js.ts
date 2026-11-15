import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { es2022Lib } from "@cubing/dev-config/esbuild/es2022";
import { build } from "esbuild";
import { FontAssetType, generateFonts, OtherAssetType } from "fantasticon";

const CUBING_ICONS_CSS_FILE_NAME = "cubing-icons.css";
const CUBING_ICONS_WOFF2_FILE_NAME = "cubing-icons.woff2";

const TEMP_LIB_OUTPUT_DIR = "./.temp/lib/";
await mkdir(TEMP_LIB_OUTPUT_DIR, { recursive: true });

const LIB_OUTPUT_DIR = "./dist/lib/@cubing/icons";
await mkdir(LIB_OUTPUT_DIR, { recursive: true });

await generateFonts({
  inputDir: "src/svg/",
  outputDir: TEMP_LIB_OUTPUT_DIR,
  fontTypes: [FontAssetType.WOFF2],
  assetTypes: [OtherAssetType.TS, OtherAssetType.CSS],
  selector: ".cubing-icon",
  name: "cubing-icons",
});

// `fantasticon` does not support a completely empty prefix: https://github.com/tancredi/fantasticon/issues/511
// So we remove the default prefix manually.
const iconsCSSContents = await readFile(
  join(TEMP_LIB_OUTPUT_DIR, CUBING_ICONS_CSS_FILE_NAME),
  "utf-8",
);
await writeFile(
  join(LIB_OUTPUT_DIR, CUBING_ICONS_CSS_FILE_NAME),
  iconsCSSContents
    .replaceAll(".cubing-icon.icon-", ".cubing-icon.")
    .replaceAll(
      ".cubing-icon:before {",
      ".cubing-icon:before {\n  vertical-align: -15%;",
    ),
);

await cp(
  join(TEMP_LIB_OUTPUT_DIR, CUBING_ICONS_WOFF2_FILE_NAME),
  join(LIB_OUTPUT_DIR, CUBING_ICONS_WOFF2_FILE_NAME),
);

const TS_ENTRY_FILE = "./src/js/index.ts";
const LIB_JS_OUTPUT_FOLDER = join(LIB_OUTPUT_DIR, "./js");

await build({
  ...es2022Lib(),
  entryPoints: [TS_ENTRY_FILE],
  outdir: LIB_JS_OUTPUT_FOLDER,
});

console.log(`The library has been built at: ${LIB_OUTPUT_DIR}`);
