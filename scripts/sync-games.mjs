// Builds src/data/games-catalog.json from the math_class games repo.
// The hub blocks non-browser requests and does not send CORS headers, so the
// site cannot read catalog.json at runtime; the build reads the repo's raw
// files and keeps a local snapshot in sync instead.
//
// Run with: npm run sync:games

import { access, writeFile } from "node:fs/promises";

const HUB_ORIGIN = "https://games.mathclass.uk";
const SOURCE = "https://raw.githubusercontent.com/NOTAM-bobk/math_class/main";
const OUTPUT = new URL("../src/data/games-catalog.json", import.meta.url);

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, `${HUB_ORIGIN}/`).toString();
}

function pathOf(url) {
  return new URL(url, `${HUB_ORIGIN}/`).pathname;
}

async function readJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.json();
}

async function readText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.text();
}

let catalog;
let config;
let coverSource = "";
try {
  [catalog, config, coverSource] = await Promise.all([
    readJson(`${SOURCE}/catalog.json`),
    readJson(`${SOURCE}/games/config.json`),
    // Covers are optional: keep the index usable if the map moves.
    readText(`${SOURCE}/src/lib/gameCovers.ts`).catch(() => ""),
  ]);
} catch (error) {
  // A build with no network can still use the snapshot from the last sync.
  try {
    await access(OUTPUT);
    console.warn(`Could not refresh the game catalogue: ${error.message}. Keeping the existing snapshot.`);
    process.exit(0);
  } catch {
    throw error;
  }
}

if (!Array.isArray(catalog)) {
  throw new Error("catalog.json did not contain an array");
}

// config.json still carries the category labels for the hand-picked games.
const categoryByPath = new Map(
  (config.games ?? [])
    .filter((game) => game?.url && game?.category)
    .map((game) => [pathOf(game.url), game.category]),
);

// The hub generates this map from /covers; parse the plain object entries.
const coverById = new Map();
for (const match of coverSource.matchAll(/"([^"]+)"\s*:\s*"(\/covers\/[^"]+)"/g)) {
  coverById.set(match[1], match[2]);
}

const games = catalog
  .filter((game) => game?.id && game?.name && game?.url && !game.disabled)
  // Hub "site-" rows point at other network sites, not games.
  .filter((game) => !String(game.id).startsWith("site-"))
  .map((game) => {
    const url = absoluteUrl(game.url);
    const category = categoryByPath.get(pathOf(url));
    const cover = coverById.get(String(game.id));
    return {
      id: String(game.id),
      name: String(game.name),
      url,
      ...(category ? { category } : {}),
      ...(cover ? { cover: `${HUB_ORIGIN}${cover}` } : {}),
      ...(game.description ? { description: String(game.description) } : {}),
      ...(Array.isArray(game.tags) && game.tags.length ? { tags: game.tags.map(String) } : {}),
      ...(game.editorsPick ? { editorsPick: true } : {}),
    };
  });

await writeFile(OUTPUT, `${JSON.stringify(games, null, 2)}\n`);
const coverCount = games.filter((game) => game.cover).length;
console.log(`Synced ${games.length} games (${coverCount} with covers) from the math_class games repo`);
