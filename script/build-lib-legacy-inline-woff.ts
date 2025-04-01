import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";
import { FontAssetType, OtherAssetType, generateFonts } from "fantasticon";
import { fixupCSS, generateFontsCommonOptions } from "./build-lib-common";

const TEMP_DIR = "./.temp/legacy-inline-woff";
const TEMP_CSS_FILE_PATH = join(TEMP_DIR, "cubing-icons.css");
const LIB_LEGACY_INLINE_WOFF_OUTPUT_DIR =
  "dist/lib/@cubing/icons/legacy-inline-woff";
const OUTPUT_CSS_FILE_PATH = join(
  LIB_LEGACY_INLINE_WOFF_OUTPUT_DIR,
  "cubing-icons.legacy-inline-woff.css",
);

await rm(TEMP_DIR, { recursive: true, force: true });
await mkdir(TEMP_DIR, { recursive: true });

await generateFonts({
  ...generateFontsCommonOptions,
  outputDir: TEMP_DIR,
  fontTypes: [FontAssetType.WOFF],
  assetTypes: [OtherAssetType.CSS],
});

await fixupCSS(TEMP_CSS_FILE_PATH);

await build({
  entryPoints: [TEMP_CSS_FILE_PATH],
  bundle: true,
  loader: { ".woff": "base64" },
  outfile: OUTPUT_CSS_FILE_PATH,
  banner: {
    css: `/*
This legacy inline WOFF build exists specifically to support the WCA website: https://github.com/thewca/worldcubeassociation.org/pull/10526

Please be prepared for this build to be removed without notice once the WCA no longer relies on it.

If you need your own build with inlined CSS and are okay with the potential performance costs, consider bundling it yourself:

    cd "$(mktemp -d)" && npm init -y && npm install esbuild @cubing/icons
    npx esbuild --bundle --minify --outfile=cubing-icons-inline.css --loader:.woff2=base64 @cubing/icons

*/
`,
  },
});

console.log(
  `The legacy inline WOFF library has been built at: ${LIB_LEGACY_INLINE_WOFF_OUTPUT_DIR}`,
);
