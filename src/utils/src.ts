import { existsSync } from "fs";

export default function src(path: string) {
  if (!existsSync("src")) return path;
  else {
    return `src${path[0] === "/" ? path : "/" + path}` as const;
  }
}
