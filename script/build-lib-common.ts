import { readFile, writeFile } from "node:fs/promises";

export const generateFontsCommonOptions = {
  inputDir: "src/svg/",
  selector: ".cubing-icon",
  name: "cubing-icons",
} as const;

export async function fixupCSS(filePath: string) {
  // `fantasticon` does not support a completely empty prefix: https://github.com/tancredi/fantasticon/issues/511
  // So we remove the default prefix manually.
  const iconsCSSContents = await readFile(filePath, "utf-8");
  await writeFile(
    filePath,
    iconsCSSContents
      .replaceAll(".cubing-icon.icon-", ".cubing-icon.")
      .replaceAll(
        ".cubing-icon:before {",
        ".cubing-icon:before {\n  vertical-align: -15%;",
      ),
  );
}
