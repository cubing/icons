import { mkdir } from "node:fs/promises";
import { FontAssetType, OtherAssetType, generateFonts } from "fantasticon";

const LIB_OUTPUT_DIR = "dist/lib/@cubing/icons";

await mkdir(LIB_OUTPUT_DIR, { recursive: true });

await generateFonts({
  inputDir: "src/svg/",
  outputDir: LIB_OUTPUT_DIR,
  fontTypes: [FontAssetType.WOFF2],
  assetTypes: [OtherAssetType.TS, OtherAssetType.CSS],
  selector: ".cubing-icon",
  name: "cubing-icons",
});
