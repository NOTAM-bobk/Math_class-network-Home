export type HubGame = {
  name: string;
  url: string;
  category: string;
  tags?: string[];
  editorsPick?: boolean;
  views?: number;
};

export const HUB_ORIGIN = "https://games.mathclass.uk";

/**
 * Snapshot of https://games.mathclass.uk/games/config.json (51 games).
 * `views` values are placeholders until the hub publishes play counts.
 */
export const HUB_GAMES: HubGame[] = [
  { name: "BitLife", url: "https://bitlife.benlaunches.icu", category: "casual" },
  { name: "Impossible Quiz", url: "https://games.mathclass.uk/games/the-impossible-quiz.html", category: "puzzle" },
  { name: "Run 3", url: "https://games.mathclass.uk/games/clrun3.html", category: "arcade", views: 3900 },
  { name: "Awesome Tanks", url: "https://games.mathclass.uk/games/awsome-tanks.html", category: "action" },
  { name: "Brawl Simulator 3D", url: "https://games.mathclass.uk/games/clbrawlsimulator3d.html", category: "action" },
  { name: "Retro Bowl", url: "https://games.mathclass.uk/games/retro-bowl.html", category: "sports", editorsPick: true, views: 4800 },
  { name: "Drive Mad", url: "https://games.mathclass.uk/games/drive-mad.html", category: "driving", editorsPick: true },
  { name: "Monster Track", url: "https://monster.benlaunches.icu/", category: "driving" },
  { name: "Monster Tracks 2", url: "https://awesometank2.benlaunches.icu/", category: "driving" },
  { name: "Moto X3M", url: "https://games.mathclass.uk/games/moto-x3m.html", category: "driving" },
  { name: "Drift Boss", url: "https://games.mathclass.uk/games/drift-boss.html", category: "driving" },
  { name: "Tunnel Rush", url: "https://games.mathclass.uk/games/tunnel-rush.html", category: "action" },
  { name: "OvO", url: "https://games.mathclass.uk/games/ovo.html", category: "arcade" },
  { name: "Stickman Hook", url: "https://games.mathclass.uk/games/stickman-hook.html", category: "arcade" },
  { name: "Doodle Jump", url: "https://games.mathclass.uk/games/doodle-jump.html", category: "arcade" },
  { name: "Flappy Bird", url: "https://games.mathclass.uk/games/flappy-bird.html", category: "arcade" },
  { name: "Crossy Road", url: "https://games.mathclass.uk/games/crossy-road.html", category: "arcade" },
  { name: "Tiny Fishing", url: "https://games.mathclass.uk/games/tiny-fishing.html", category: "casual" },
  { name: "Cookie Clicker", url: "https://games.mathclass.uk/games/cookie-clicker.html", category: "casual", editorsPick: true, views: 2600 },
  { name: "2048", url: "https://games.mathclass.uk/games/2048.html", category: "puzzle" },
  { name: "Super Smash Flash", url: "https://games.mathclass.uk/games/super-smash-flash.html", category: "action" },
  { name: "Super Mario 63", url: "https://games.mathclass.uk/games/super-mario-63.html", category: "adventure" },
  { name: "Fancy Pants Adventures", url: "https://games.mathclass.uk/games/fancy-pants-adventures.html", category: "adventure" },
  { name: "Dad 'n Me", url: "https://games.mathclass.uk/games/dad-n-me.html", category: "action" },
  { name: "Portal: The Flash Version", url: "https://games.mathclass.uk/games/portal-flash.html", category: "puzzle" },
  { name: "Henry Stickmin: Escaping the Prison", url: "https://games.mathclass.uk/games/henry-stickmin-escaping-the-prison.html", category: "adventure" },
  { name: "Henry Stickmin: Breaking the Bank", url: "https://games.mathclass.uk/games/henry-stickmin-breaking-the-bank.html", category: "adventure" },
  { name: "Stick RPG", url: "https://games.mathclass.uk/games/stick-rpg.html", category: "casual" },
  { name: "Bloons Tower Defense 4", url: "https://games.mathclass.uk/games/bloons-td4.html", category: "strategy" },
  { name: "Bloons Super Monkey", url: "https://games.mathclass.uk/games/bloons-super-monkey.html", category: "action" },
  { name: "The World's Hardest Game", url: "https://games.mathclass.uk/games/the-worlds-hardest-game.html", category: "skill" },
  { name: "Learn to Fly", url: "https://games.mathclass.uk/games/learn-to-fly.html", category: "arcade", editorsPick: true },
  { name: "Papa's Pizzeria", url: "https://games.mathclass.uk/games/papas-pizzeria.html", category: "casual" },
  { name: "Bloxorz", url: "https://games.mathclass.uk/games/bloxorz.html", category: "puzzle" },
  { name: "Age of War", url: "https://games.mathclass.uk/games/age-of-war.html", category: "strategy" },
  { name: "Duck Life", url: "https://games.mathclass.uk/games/duck-life.html", category: "casual" },
  { name: "Duck Life 2: World Champion", url: "https://games.mathclass.uk/games/duck-life-2.html", category: "casual" },
  { name: "Riddle School", url: "https://games.mathclass.uk/games/riddle-school.html", category: "puzzle" },
  { name: "Riddle School 3", url: "https://games.mathclass.uk/games/riddle-school-3.html", category: "puzzle" },
  { name: "HexGL", url: "https://hexgl.poly2.benlaunches.icu", category: "driving", tags: ["Driving", "Racing", "Sci-Fi", "3D", "Speed"] },
  { name: "Cut the Rope", url: "https://cutthe.benlaunches.icu", category: "puzzle", tags: ["Puzzle", "Physics", "Classic", "Logic"] },
  { name: "Geometry Dash", url: "https://games.mathclass.uk/games/geometry-dash.html", category: "arcade", tags: ["Arcade", "Rhythm", "Platformer", "Skill", "Hard"], editorsPick: true, views: 3100 },
  { name: "Basket Random", url: "https://games.mathclass.uk/games/basket-random.html", category: "sports", tags: ["Sports", "Basketball", "Physics", "2 Player", "Funny"] },
  { name: "Basketball Stars", url: "https://games.mathclass.uk/games/basketball-stars.html", category: "sports", tags: ["Sports", "Basketball", "2 Player", "Skill", "Tournament"] },
  { name: "Getaway Shootout", url: "https://games.mathclass.uk/games/getaway-shootout.html", category: "action", tags: ["Action", "Physics", "2 Player", "Shooter", "Multiplayer"] },
  { name: "Bad Ice-Cream", url: "https://games.mathclass.uk/games/bad-ice-cream.html", category: "arcade", tags: ["Arcade", "Retro", "Puzzle", "Classic", "2 Player"] },
  { name: "Iron Snout", url: "https://games.mathclass.uk/games/iron-snout.html", category: "action", tags: ["Action", "Combat", "Fighting", "Arcade", "Reflex"] },
  { name: "We Become What We Behold", url: "https://games.mathclass.uk/games/we-become-what-we-behold.html", category: "casual", tags: ["Casual", "Indie", "Story", "Short", "Simulation"] },
  { name: "Happy Wheels", url: "https://games.mathclass.uk/games/happy-wheels.html", category: "action", tags: ["Action", "Physics", "Obstacles", "Classic", "Funny"], views: 2200 },
  { name: "Duck Life 3: Evolution", url: "https://games.mathclass.uk/games/duck-life-3.html", category: "casual", tags: ["Casual", "Training", "Racing", "Pets", "Upgrade"] },
  { name: "Vex 4", url: "https://games.mathclass.uk/games/vex-4.html", category: "arcade", tags: ["Arcade", "Parkour", "Platformer", "Skill", "Stickman"] },
];

export const MOST_VIEWED = HUB_GAMES.filter((game) => game.views).sort(
  (a, b) => (b.views ?? 0) - (a.views ?? 0),
);

export function hubSearchUrl(query: string) {
  const trimmed = query.trim();
  return trimmed ? `${HUB_ORIGIN}/?q=${encodeURIComponent(trimmed)}` : `${HUB_ORIGIN}/`;
}
