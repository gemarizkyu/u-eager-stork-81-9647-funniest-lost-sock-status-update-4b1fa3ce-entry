// The Funniest Lost Sock Status Update — make.fun entry program.
//
// This program is the whole entry. It loads the one-line lost-sock
// status update stored beside it in sock.txt and writes that line,
// unchanged, to /output/entry.txt, where the sealed gate scorer
// reads it.
//
// The update lives in sock.txt so the text the judge sees is exactly
// the text reviewed in this repository. Nothing is generated at run
// time: no model call, no randomness, no clock. Every run writes the
// same bytes, so the replay matches the live run exactly.
//
// The joke in one sentence: the sock is not lost at all, it is hiding
// in witness protection — the dryer knows too much, and its own pair
// talks. It is a status update in a small, domestic, slightly anxious
// sock voice; the premise (a sock that has ended up somewhere it
// should not be) makes the hiding inevitable; the twist turns the
// obvious dryer-and-missing-partner material somewhere unexpected;
// and the laugh lands on the last words. The line is 92 characters,
// well under the 120-character gate, so no trimming is needed at run
// time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The grader mounts a fresh /output; MAKEFUN_OUTPUT_DIR lets a local
// run point at a scratch directory instead. It is only a path.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Resolve the sock file from this module's own URL, never from the
// working directory, so the program works wherever the grader runs it.
const SOCK_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "sock.txt",
);

// The gate allows 1-120 characters; keep the bound in one place.
const MAX_CHARS = 120;
const sock = readFileSync(SOCK_PATH, "utf8").replace(/\r?\n$/, "");

// Self-check before finishing: the gate wants UTF-8 text of 1-120
// characters, not only whitespace, on a single line.
if (sock.length < 1 || sock.length > MAX_CHARS) {
  throw new Error(`sock update must be 1-${MAX_CHARS} characters, got ${sock.length}`);
}
if (!sock.trim()) {
  throw new Error("sock update must not be only whitespace");
}
if (sock.includes("\n") || sock.includes("\r")) {
  throw new Error("sock update must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, sock, "utf8");

// Read back and confirm the written bytes are exactly the update.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== sock) {
  throw new Error("read-back mismatch: /output/entry.txt differs");
}

console.log(`wrote ${sock.length} characters to ${OUTPUT_FILE}`);
