/**
 * GitHub Pages serves 404.html for unknown paths. Copying the built SPA shell
 * there lets React Router take over on deep links such as /classes/geometry.
 */
import { copyFile, access } from "node:fs/promises";

const src = new URL("../dist/index.html", import.meta.url);
const dest = new URL("../dist/404.html", import.meta.url);

await access(src);
await copyFile(src, dest);
console.log("SPA fallback written to dist/404.html");
