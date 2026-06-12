#!/usr/bin/env node
/**
 * dev/_check.js
 * Extracts the inline <script> from ../index.html and validates its syntax
 * by compiling it with the `vm` module (compiles, does not execute — so the
 * browser-only THREE / DOM references are fine).
 *
 * Usage:  node dev/_check.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

// grab inline scripts (those WITHOUT a src= attribute)
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (inline.length === 0) {
  console.error("✗ No inline <script> block found in index.html");
  process.exit(1);
}
const code = inline[inline.length - 1]; // the simulator script is the last one

try {
  new vm.Script(code, { filename: "index.html (inline script)" });
  console.log(`✓ Syntax OK — ${code.length} chars compiled cleanly.`);
  process.exit(0);
} catch (err) {
  console.error("✗ Syntax error in inline script:");
  console.error(err.message);
  process.exit(1);
}
