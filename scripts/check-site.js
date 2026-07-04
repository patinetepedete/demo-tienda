const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = ["index.html", "styles.css", "script.js"];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");
const checks = [
  ["product filters", html.includes("data-filter") && js.includes("renderProducts")],
  ["scroll reveal", html.includes("data-reveal") && js.includes("IntersectionObserver")],
  ["lookbook anchors", html.includes("#look-casual") && html.includes("#look-street")],
  ["responsive styles", css.includes("@media")],
  ["reduced motion", css.includes("prefers-reduced-motion")]
];
const failed = checks.filter(([, ok]) => !ok);

if (failed.length) {
  console.error(`Build checks failed: ${failed.map(([name]) => name).join(", ")}`);
  process.exit(1);
}

console.log("Build checks passed.");
