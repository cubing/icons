// We re-export from a symlink in the same folder, so that the output produced
// by TypeScript is flat (without requiring additional workarounds).

export {
  CUBING_ICONS_CODEPOINTS,
  CubingIcons,
  type CubingIconsId as CubingIconsClassName,
  type CubingIconsKey,
} from "./cubing-icons";
