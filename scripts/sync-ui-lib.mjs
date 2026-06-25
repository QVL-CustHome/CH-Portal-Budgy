import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const portalRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libRoot = process.env.CH_UI_LIBRARY_PATH ?? path.resolve(portalRoot, "..", "CH-UI-Library");
const libDist = path.join(libRoot, "dist");
const target = path.join(portalRoot, "node_modules", "@custhome", "ui", "dist");

if (!existsSync(libDist)) {
  console.log(`[sync-ui-lib] pas de dist local (${libDist}) : version installee conservee.`);
  process.exit(0);
}

if (!existsSync(path.dirname(target))) {
  console.log("[sync-ui-lib] @custhome/ui absent de node_modules : lancer npm install d'abord.");
  process.exit(0);
}

rmSync(target, { recursive: true, force: true });
cpSync(libDist, target, { recursive: true });
console.log(`[sync-ui-lib] dist local de CH-UI-Library synchronise (${libDist}).`);
