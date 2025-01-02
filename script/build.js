import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateFonts } from "fantasticon";

const OUTPUT_DIR = "dist/@cubing/icons";
const OUTPUT_ICONS_CSS = join(OUTPUT_DIR, "cubing-icons.css");

await mkdir(OUTPUT_DIR, { recursive: true });

await generateFonts({
  inputDir: "src/svg",
  outputDir: OUTPUT_DIR,
  fontTypes: ["ttf", "woff", "woff2"],
  assetTypes: ["ts", "css"],
  selector: ".cubing-icon",
  name: "cubing-icons",
});

// `fantasticon` does not support a completely empty prefix: https://github.com/tancredi/fantasticon/issues/511
// So we remove the default prefix manually.
const iconsCSSContents = await readFile(OUTPUT_ICONS_CSS, "utf-8");
await writeFile(
  OUTPUT_ICONS_CSS,
  iconsCSSContents.replaceAll(".cubing-icon.icon-", ".cubing-icon."),
);
