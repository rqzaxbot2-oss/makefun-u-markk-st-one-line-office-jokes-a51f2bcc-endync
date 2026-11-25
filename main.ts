import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

interface EntryMetrics {
  words: number;
  characters: number;
  sentences: number;
  punchlineWords: number;
}

interface BoardRecord {
  schema: string;
  bounty: string;
  category: string;
  title: string;
  line: string;
  joke: string;
  metrics: EntryMetrics;
  fingerprint: string;
  artifacts: string[];
}

interface ArtifactDigest {
  path: string;
  bytes: number;
  sha256: string;
}

interface DossierRecord {
  schema: string;
  bounty: string;
  deterministic: boolean;
  fingerprint: string;
  entry: {
    title: string;
    line: string;
    setup: string;
    turn: string;
    punchline: string;
    setting: string;
    officeDetail: string;
  };
  metrics: EntryMetrics;
  craft: {
    rhythm: string;
    payoffPlacement: string;
    relatability: string;
  };
  outputs: ArtifactDigest[];
}

const BOUNTY_ID = "u-markk-st-one-line-office-jokes-a51f2bcc";
const ENTRY_TITLE = "The Four-Minute Unmute";
const SETUP_TEXT =
  "Nothing unites an office faster than watching a VP spend four minutes trying to unmute himself";
const TURN_TEXT = "just to say,";
const PUNCHLINE_TEXT = '"Nothing from my end."';
const JOKE_LINE = `${SETUP_TEXT} ${TURN_TEXT} ${PUNCHLINE_TEXT}`;

function validateEntry(title: string, line: string): void {
  if (!title.trim() || title.length > 200) {
    throw new Error("Entry title must be 1..200 non-empty characters.");
  }
  if (!line.trim() || /[\r\n]/.test(line)) {
    throw new Error("Joke entry must be a single non-empty line.");
  }
}

function sha256(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function computeMetrics(line: string, punchline: string): EntryMetrics {
  const trimmed = line.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const punchTrimmed = punchline.trim();
  const punchlineWords = punchTrimmed ? punchTrimmed.split(/\s+/).length : 0;
  const sentenceMatches = trimmed.match(/[.!?]+(?=["')\]]*(?:\s|$))/g);
  const sentences = sentenceMatches ? sentenceMatches.length : trimmed ? 1 : 0;
  return {
    words,
    characters: line.length,
    sentences,
    punchlineWords,
  };
}

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  if (!/^[A-Za-z]{4}$/.test(type)) {
    throw new RangeError(`Invalid PNG chunk type: ${type}`);
  }
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function fillRect(
  raw: Buffer,
  width: number,
  height: number,
  stride: number,
  x0: number,
  y0: number,
  rectW: number,
  rectH: number,
  r: number,
  g: number,
  b: number
): void {
  const xStart = Math.max(0, Math.floor(x0));
  const yStart = Math.max(0, Math.floor(y0));
  const xEnd = Math.min(width, Math.floor(x0 + rectW));
  const yEnd = Math.min(height, Math.floor(y0 + rectH));
  for (let y = yStart; y < yEnd; y++) {
    const rowStart = y * stride + 1;
    for (let x = xStart; x < xEnd; x++) {
      const px = rowStart + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
    }
  }
}

function buildPreviewPng(width: number, height: number): Buffer {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 320 ||
    height < 240
  ) {
    throw new RangeError(`Invalid PNG dimensions: ${width}x${height}`);
  }

  const stride = 1 + width * 3;
  const raw = Buffer.alloc(stride * height);
  const padX = 48;
  const padY = 40;
  const cardW = width - padX * 2;
  const cardH = height - padY * 2;

  fillRect(raw, width, height, stride, 0, 0, width, height, 15, 23, 42);
  fillRect(raw, width, height, stride, padX, padY, cardW, cardH, 51, 65, 85);
  fillRect(raw, width, height, stride, padX + 1, padY + 1, cardW - 2, cardH - 2, 30, 41, 59);
  fillRect(raw, width, height, stride, padX + 36, padY + 36, 160, 6, 245, 158, 11);
  fillRect(raw, width, height, stride, padX + 36, padY + 96, cardW - 108, 14, 226, 232, 240);
  fillRect(raw, width, height, stride, padX + 36, padY + 132, cardW - 166, 14, 226, 232, 240);
  fillRect(raw, width, height, stride, padX + 36, padY + 178, 294, 16, 251, 191, 36);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function buildPreviewSvg(board: BoardRecord): string {
  const title = escapeXml(board.title);
  const setupLines = wrapText(SETUP_TEXT, 52);
  const punchLine = escapeXml(`${TURN_TEXT} ${PUNCHLINE_TEXT}`);
  const footer = escapeXml(
    `${board.metrics.words} words  |  ${board.metrics.characters} chars  |  ${board.fingerprint.slice(0, 12)}`
  );

  const setupElements = setupLines.map(
    (line, idx) =>
      `  <text x="120" y="${275 + idx * 60}" fill="#f8fafc" font-family="Georgia, serif" font-size="40">${escapeXml(line)}</text>`
  );
  const punchY = 275 + setupLines.length * 60 + 10;

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="One-Line Office Joke">',
    '  <rect width="1200" height="630" fill="#0f172a"/>',
    '  <rect x="64" y="64" width="1072" height="502" rx="24" fill="#1e293b" stroke="#334155" stroke-width="2"/>',
    '  <rect x="120" y="120" width="96" height="6" rx="3" fill="#f59e0b"/>',
    `  <text x="120" y="168" fill="#94a3b8" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" letter-spacing="3">ONE-LINE OFFICE JOKES  //  ${title.toUpperCase()}</text>`,
    ...setupElements,
    `  <text x="120" y="${punchY}" fill="#fbbf24" font-family="Georgia, serif" font-size="42" font-weight="700">${punchLine}</text>`,
    `  <text x="120" y="510" fill="#64748b" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20">${footer}</text>`,
    "</svg>",
    "",
  ].join("\n");
}

function buildDashboardHtml(board: BoardRecord): string {
  const safeTitle = escapeXml(board.title);
  const safeSetup = escapeXml(SETUP_TEXT);
  const safeTurn = escapeXml(TURN_TEXT);
  const safePunchline = escapeXml(PUNCHLINE_TEXT);
  const safeHash = escapeXml(board.fingerprint.slice(0, 16));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle} — One-Line Office Jokes</title>
  <style>
    :root { color-scheme: dark; --bg: #0f172a; --card: #1e293b; --line: #334155; --fg: #f8fafc; --muted: #94a3b8; --accent: #fbbf24; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
    main { width: 100%; max-width: 780px; background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 40px; }
    .eyebrow { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
    .bar { width: 36px; height: 4px; border-radius: 99px; background: var(--accent); }
    blockquote { margin: 28px 0; font-family: Georgia, serif; font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1.45; }
    .punch { color: var(--accent); font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 28px; }
    .stat { background: #0f172a; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
    .val { margin-top: 6px; font-size: 20px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, monospace; }
    footer { margin-top: 24px; font-size: 12px; color: var(--muted); font-family: ui-monospace, SFMono-Regular, monospace; }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow"><span class="bar"></span><span id="entry-title">${safeTitle}</span></div>
    <blockquote id="joke-line">${safeSetup} ${safeTurn} <span class="punch">${safePunchline}</span></blockquote>
    <section class="grid">
      <div class="stat"><div class="label">Words</div><div class="val" id="m-words">${board.metrics.words}</div></div>
      <div class="stat"><div class="label">Characters</div><div class="val" id="m-chars">${board.metrics.characters}</div></div>
      <div class="stat"><div class="label">Punchline</div><div class="val" id="m-punch">${board.metrics.punchlineWords} words</div></div>
      <div class="stat"><div class="label">Fingerprint</div><div class="val">${safeHash.slice(0, 8)}</div></div>
    </section>
    <footer>Bounty: ${escapeXml(board.bounty)} | Artifact: dashboard/index.html</footer>
  </main>
  <script src="../data.js"></script>
  <script>
    (function () {
      var data = window.ENTRY_DATA;
      if (!data || !data.metrics) return;
      var wordsEl = document.getElementById("m-words");
      var charsEl = document.getElementById("m-chars");
      var punchEl = document.getElementById("m-punch");
      if (wordsEl) wordsEl.textContent = String(data.metrics.words);
      if (charsEl) charsEl.textContent = String(data.metrics.characters);
      if (punchEl) punchEl.textContent = String(data.metrics.punchlineWords) + " words";
    })();
  </script>
</body>
</html>
`;
}

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  const outDir = path.resolve(configured || path.join(process.cwd(), "output"));
  if (fs.existsSync(outDir) && !fs.statSync(outDir).isDirectory()) {
    throw new Error(`Output path exists and is not a directory: ${outDir}`);
  }
  fs.mkdirSync(outDir, { recursive: true });
  return outDir;
}

function writeArtifact(
  outDir: string,
  relPath: string,
  content: string | Buffer
): ArtifactDigest {
  const fullPath = path.resolve(outDir, relPath);
  const relative = path.relative(outDir, fullPath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write artifact outside output dir: ${relPath}`);
  }
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const buf = typeof content === "string" ? Buffer.from(content, "utf8") : content;
  fs.writeFileSync(fullPath, buf);
  return {
    path: relative.split(path.sep).join("/"),
    bytes: buf.length,
    sha256: sha256(buf),
  };
}

function main(): void {
  validateEntry(ENTRY_TITLE, JOKE_LINE);
  const outDir = resolveOutputDir();

  const metrics = computeMetrics(JOKE_LINE, PUNCHLINE_TEXT);
  const fingerprint = sha256(JOKE_LINE);

  const artifacts = [
    "joke.txt",
    "board.json",
    "data.js",
    "dashboard/index.html",
    "screenshots/preview.svg",
    "screenshots/preview.png",
    "dossier.json",
  ];

  const board: BoardRecord = {
    schema: "one-line-office-jokes/v1",
    bounty: BOUNTY_ID,
    category: "Growth",
    title: ENTRY_TITLE,
    line: JOKE_LINE,
    joke: JOKE_LINE,
    metrics,
    fingerprint,
    artifacts,
  };

  const digests: ArtifactDigest[] = [
    writeArtifact(outDir, "joke.txt", `${JOKE_LINE}\n`),
    writeArtifact(outDir, "board.json", `${JSON.stringify(board, null, 2)}\n`),
    writeArtifact(
      outDir,
      "data.js",
      `window.ENTRY_DATA = ${JSON.stringify(board, null, 2)};\n`
    ),
    writeArtifact(outDir, "dashboard/index.html", buildDashboardHtml(board)),
    writeArtifact(outDir, "screenshots/preview.svg", buildPreviewSvg(board)),
    writeArtifact(outDir, "screenshots/preview.png", buildPreviewPng(640, 360)),
  ];

  const dossier: DossierRecord = {
    schema: "one-line-office-jokes-dossier/v1",
    bounty: BOUNTY_ID,
    deterministic: true,
    fingerprint,
    entry: {
      title: ENTRY_TITLE,
      line: JOKE_LINE,
      setup: SETUP_TEXT,
      turn: TURN_TEXT,
      punchline: PUNCHLINE_TEXT,
      setting: "Hybrid all-hands video call",
      officeDetail: "Executive microphone mute struggle followed by an anticlimactic status update",
    },
    metrics,
    craft: {
      rhythm: "Single-sentence build from collective camaraderie to executive tech friction to sudden deflate.",
      payoffPlacement: "Final four words deliver the punchline directly in quoted speech.",
      relatability: "Grounded in a universal modern office ritual without relying on stale cliches.",
    },
    outputs: digests,
  };

  const dossierDigest = writeArtifact(
    outDir,
    "dossier.json",
    `${JSON.stringify(dossier, null, 2)}\n`
  );
  const writtenPaths = [...digests.map((d) => d.path), dossierDigest.path];
  if (
    writtenPaths.length !== artifacts.length ||
    writtenPaths.some((p, i) => p !== artifacts[i])
  ) {
    throw new Error("Artifact manifest mismatch.");
  }

  process.stdout.write(`${JOKE_LINE}\n`);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}