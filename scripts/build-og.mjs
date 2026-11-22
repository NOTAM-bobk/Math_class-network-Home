/**
 * Builds dist/og-image.png (1200x630) from flat shapes.
 * Keeping the card as code means the repo stays text-only and the asset can
 * never drift from the brand colours used in src/styles.css.
 */
import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";

const WIDTH = 1200;
const HEIGHT = 630;
const SS = 3; // supersampling factor for smooth edges
const CW = WIDTH * SS;
const CH = HEIGHT * SS;

const COLOURS = {
  paper: [255, 252, 246],
  dots: [237, 228, 211],
  ink: [20, 18, 31],
  indigo: [73, 48, 245],
  lime: [210, 248, 111],
  coral: [255, 139, 99],
  sky: [165, 227, 255],
  lavender: [238, 235, 255],
};

const pixels = Buffer.alloc(CW * CH * 3);
for (let i = 0; i < CW * CH; i += 1) {
  pixels[i * 3] = COLOURS.paper[0];
  pixels[i * 3 + 1] = COLOURS.paper[1];
  pixels[i * 3 + 2] = COLOURS.paper[2];
}

function put(x, y, colour) {
  if (x < 0 || y < 0 || x >= CW || y >= CH) return;
  const i = (y * CW + x) * 3;
  pixels[i] = colour[0];
  pixels[i + 1] = colour[1];
  pixels[i + 2] = colour[2];
}

function circle(cx, cy, radius, colour) {
  const x0 = Math.max(0, Math.floor((cx - radius) * SS));
  const x1 = Math.min(CW - 1, Math.ceil((cx + radius) * SS));
  const y0 = Math.max(0, Math.floor((cy - radius) * SS));
  const y1 = Math.min(CH - 1, Math.ceil((cy + radius) * SS));
  const r2 = (radius * SS) ** 2;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx * SS;
      const dy = y - cy * SS;
      if (dx * dx + dy * dy <= r2) put(x, y, colour);
    }
  }
}

function ring(cx, cy, radius, thickness, colour) {
  const outer = (radius * SS) ** 2;
  const inner = ((radius - thickness) * SS) ** 2;
  const x0 = Math.max(0, Math.floor((cx - radius) * SS));
  const x1 = Math.min(CW - 1, Math.ceil((cx + radius) * SS));
  const y0 = Math.max(0, Math.floor((cy - radius) * SS));
  const y1 = Math.min(CH - 1, Math.ceil((cy + radius) * SS));
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx * SS;
      const dy = y - cy * SS;
      const d = dx * dx + dy * dy;
      if (d <= outer && d >= inner) put(x, y, colour);
    }
  }
}

function roundedRect(x0, y0, x1, y1, radius, colour) {
  const left = x0 * SS;
  const top = y0 * SS;
  const right = x1 * SS;
  const bottom = y1 * SS;
  const r = radius * SS;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const inX = x < left + r ? left + r : x > right - r ? right - r : x;
      const inY = y < top + r ? top + r : y > bottom - r ? bottom - r : y;
      const dx = x - inX;
      const dy = y - inY;
      if (dx * dx + dy * dy <= r * r) put(x, y, colour);
    }
  }
}

function line(x0, y0, x1, y1, thickness, colour) {
  const ax = x0 * SS;
  const ay = y0 * SS;
  const bx = x1 * SS;
  const by = y1 * SS;
  const half = (thickness * SS) / 2;
  const xMin = Math.max(0, Math.floor(Math.min(ax, bx) - half));
  const xMax = Math.min(CW - 1, Math.ceil(Math.max(ax, bx) + half));
  const yMin = Math.max(0, Math.floor(Math.min(ay, by) - half));
  const yMax = Math.min(CH - 1, Math.ceil(Math.max(ay, by) + half));
  const vx = bx - ax;
  const vy = by - ay;
  const lengthSq = vx * vx + vy * vy || 1;
  for (let y = yMin; y <= yMax; y += 1) {
    for (let x = xMin; x <= xMax; x += 1) {
      const t = Math.min(1, Math.max(0, ((x - ax) * vx + (y - ay) * vy) / lengthSq));
      const dx = x - (ax + t * vx);
      const dy = y - (ay + t * vy);
      if (dx * dx + dy * dy <= half * half) put(x, y, colour);
    }
  }
}

// --- composition -----------------------------------------------------------
for (let x = 14; x < WIDTH; x += 26) {
  for (let y = 14; y < HEIGHT; y += 26) {
    circle(x, y, 1.4, COLOURS.dots);
  }
}

circle(-70, -80, 320, COLOURS.lime);
circle(1180, 720, 330, COLOURS.lavender);

ring(880, 168, 52, 12, COLOURS.coral);
circle(322, 452, 30, COLOURS.sky);
circle(1010, 520, 14, COLOURS.indigo);

roundedRect(450, 165, 750, 465, 76, COLOURS.indigo);
line(520, 235, 680, 395, 30, COLOURS.paper);
line(680, 235, 520, 395, 30, COLOURS.paper);
circle(724, 192, 28, COLOURS.lime);

// --- encode PNG ------------------------------------------------------------
const out = Buffer.alloc(WIDTH * HEIGHT * 3);
for (let y = 0; y < HEIGHT; y += 1) {
  for (let x = 0; x < WIDTH; x += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let sy = 0; sy < SS; sy += 1) {
      for (let sx = 0; sx < SS; sx += 1) {
        const i = ((y * SS + sy) * CW + (x * SS + sx)) * 3;
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
      }
    }
    const n = SS * SS;
    const o = (y * WIDTH + x) * 3;
    out[o] = Math.round(r / n);
    out[o + 1] = Math.round(g / n);
    out[o + 2] = Math.round(b / n);
  }
}

const raw = Buffer.alloc(HEIGHT * (WIDTH * 3 + 1));
for (let y = 0; y < HEIGHT; y += 1) {
  const rowStart = y * (WIDTH * 3 + 1);
  raw[rowStart] = 0;
  out.copy(raw, rowStart + 1, y * WIDTH * 3, (y + 1) * WIDTH * 3);
}

const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolour RGB
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/og-image.png", import.meta.url), png);
console.log(`OG image written to dist/og-image.png (${(png.length / 1024).toFixed(1)} kB)`);
