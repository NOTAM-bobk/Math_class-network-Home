// Builds src/data/games-catalog.json from the live math_class games hub.
// The hub does not send CORS headers, so the site cannot read catalog.json at
// runtime; this script keeps a local snapshot in sync instead.
//
// Run with: npm run sync:games

import { access, writeFile } from "node:fs/promises";

const HUB_ORIGIN = "https://games.mathclass.uk";
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

let catalog;
let config;
try {
  [catalog, config] = await Promise.all([
    readJson(`${HUB_ORIGIN}/catalog.json`),
    readJson(`${HUB_ORIGIN}/games/config.json`),
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

const games = catalog
  .filter((game) => game?.id && game?.name && game?.url && !game.disabled)
  // Hub "site-" rows point at other network sites, not games.
  .filter((game) => !String(game.id).startsWith("site-"))
  .map((game) => {
    const url = absoluteUrl(game.url);
    const category = categoryByPath.get(pathOf(url));
    return {
      id: String(game.id),
      name: String(game.name),
      url,
      ...(category ? { category } : {}),
      ...(game.description ? { description: String(game.description) } : {}),
      ...(Array.isArray(game.tags) && game.tags.length ? { tags: game.tags.map(String) } : {}),
      ...(game.editorsPick ? { editorsPick: true } : {}),
    };
  });

await writeFile(OUTPUT, `${JSON.stringify(games, null, 2)}\n`);
console.log(`Synced ${games.length} games from ${HUB_ORIGIN}/catalog.json`);
