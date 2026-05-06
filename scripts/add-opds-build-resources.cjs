const fs = require("fs");
const path = require("path");

const APP_ORIGIN = "https://spix.flowonline.app";
const DIST_DIR = path.resolve("dist");
const ASSETS_DIR = path.join(DIST_DIR, "assets");
const OPDS_DIR = path.join(DIST_DIR, "opds");

const mimeTypes = new Map([
  [".css", "text/css"],
  [".gif", "image/gif"],
  [".html", "text/html"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript"],
  [".json", "application/json"],
  [".mjs", "text/javascript"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

function resource(hrefPath, type) {
  return {
    href: APP_ORIGIN + hrefPath,
    type,
  };
}

const weekHtmlResources = [];
for (let week = 1; week <= 5; week += 1) {
  weekHtmlResources.push(resource("/tot2/week" + week, "text/html"));
  weekHtmlResources.push(resource("/tot2?startWeek=" + week, "text/html"));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).reduce((files, entry) => {
    const absolutePath = path.join(dir, entry.name);
    return files.concat(entry.isDirectory() ? listFiles(absolutePath) : absolutePath);
  }, []);
}

function resourceForBuiltFile(filePath) {
  const relativePath = path.relative(DIST_DIR, filePath).split(path.sep).join("/");
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes.get(ext);

  if (!type) return null;
  return resource("/" + relativePath, type);
}

function addResources(manifestPath, resources) {
  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const existing = new Set((manifest.resources || []).map((item) => item.href));
  const additions = resources.filter((item) => {
    if (!item || existing.has(item.href)) return false;
    existing.add(item.href);
    return true;
  });

  manifest.resources = (manifest.resources || []).concat(additions);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

const builtFileResources = [
  resource("/index.html", "text/html"),
].concat(
  listFiles(DIST_DIR)
    .filter((filePath) => !path.relative(DIST_DIR, filePath).split(path.sep).includes("opds"))
    .map(resourceForBuiltFile)
    .filter(Boolean),
);

const sharedResources = weekHtmlResources.concat(builtFileResources);

[
  "tot2-manifest.json",
  "tot2-week1-manifest.json",
  "tot2-week2-manifest.json",
  "tot2-week3-manifest.json",
  "tot2-week4-manifest.json",
  "tot2-week5-manifest.json",
].forEach((fileName) => {
  addResources(path.join(OPDS_DIR, fileName), sharedResources);
});
