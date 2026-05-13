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

function relativeResource(href, type) {
  return { href, type };
}

const weekHtmlResources = [];
for (let week = 1; week <= 5; week += 1) {
  weekHtmlResources.push(resource("/tot2/week" + week, "text/html"));
  weekHtmlResources.push(resource("/tot2/week" + week + "/", "text/html"));
  weekHtmlResources.push(resource("/tot2/week" + week + "/index.html", "text/html"));
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
  resource("/tot2", "text/html"),
  resource("/tot2/", "text/html"),
].concat(
  listFiles(DIST_DIR)
    .filter((filePath) => !path.relative(DIST_DIR, filePath).split(path.sep).includes("opds"))
    .map(resourceForBuiltFile)
    .filter(Boolean),
);

const sharedResources = weekHtmlResources.concat(builtFileResources);

function relativeResourceForBuiltFile(filePath) {
  const relativePath = path.relative(DIST_DIR, filePath).split(path.sep).join("/");
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes.get(ext);

  if (!type) return null;
  return relativeResource("../" + relativePath, type);
}

const relativeWeekResources = [];
for (let week = 1; week <= 5; week += 1) {
  relativeWeekResources.push(relativeResource("../tot2/week" + week, "text/html"));
  relativeWeekResources.push(relativeResource("../tot2/week" + week + "/", "text/html"));
  relativeWeekResources.push(relativeResource("../tot2/week" + week + "/index.html", "text/html"));
  relativeWeekResources.push(relativeResource("../tot2?startWeek=" + week, "text/html"));
}

const relativeBuiltFileResources = [
  relativeResource("../index.html", "text/html"),
  relativeResource("../tot2", "text/html"),
  relativeResource("../tot2/", "text/html"),
].concat(
  listFiles(DIST_DIR)
    .filter((filePath) => !path.relative(DIST_DIR, filePath).split(path.sep).includes("opds"))
    .map(relativeResourceForBuiltFile)
    .filter(Boolean),
);

const relativeSharedResources = relativeWeekResources.concat(relativeBuiltFileResources);

function addRelativeResourcesToWebpub(manifestPath) {
  addResources(manifestPath, relativeSharedResources);
}

function copyAppShellToWeekLaunchers() {
  const appShellPath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(appShellPath)) return;

  const appShell = fs
    .readFileSync(appShellPath, "utf8")
    .replaceAll('href="/', 'href="../../')
    .replaceAll('src="/', 'src="../../');
  for (let week = 1; week <= 5; week += 1) {
    const launcherPath = path.join(DIST_DIR, "tot2", "week" + week, "index.html");
    fs.mkdirSync(path.dirname(launcherPath), { recursive: true });
    fs.writeFileSync(launcherPath, appShell);
  }
}

copyAppShellToWeekLaunchers();

const OPEN_ACCESS_REL = "http://opds-spec.org/acquisition/open-access";

function weekLaunchLinks(week) {
  return [
    resource("/tot2/week" + week + "/index.html", "text/html"),
    resource("/tot2/week" + week + "/", "text/html"),
    resource("/tot2/week" + week, "text/html"),
    resource("/tot2?startWeek=" + week, "text/html"),
  ].map((item) => ({
    rel: OPEN_ACCESS_REL,
    href: item.href,
    type: item.type,
  }));
}

function normalizeWeekManifestLaunch(manifestPath, week) {
  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.metadata = manifest.metadata || {};
  manifest.metadata.identifier = APP_ORIGIN + "/tot2/week" + week + "/index.html";
  manifest.links = (manifest.links || [])
    .filter((link) => link.rel !== OPEN_ACCESS_REL)
    .concat(weekLaunchLinks(week));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

function normalizeCatalogLaunches(catalogPath) {
  if (!fs.existsSync(catalogPath)) return;

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  for (const publication of catalog.publications || []) {
    const currentIdentifier = publication.metadata && publication.metadata.identifier;
    const match = currentIdentifier && currentIdentifier.match(/\/week(\d+)(?:\/index\.html)?\/?$/);
    if (!match) continue;

    const week = Number(match[1]);
    publication.metadata.identifier = APP_ORIGIN + "/tot2/week" + week + "/index.html";
    publication.links = (publication.links || [])
      .filter((link) => link.rel !== OPEN_ACCESS_REL)
      .concat(weekLaunchLinks(week));
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
}

[
  "tot2-manifest.json",
  "tot2-week1-manifest.json",
  "tot2-week2-manifest.json",
  "tot2-week3-manifest.json",
  "tot2-week4-manifest.json",
  "tot2-week5-manifest.json",
].forEach((fileName) => {
  addResources(path.join(OPDS_DIR, fileName), sharedResources);
  addRelativeResourcesToWebpub(path.join(OPDS_DIR, fileName));

  const weekMatch = fileName.match(/week(\d+)/);
  if (weekMatch) {
    normalizeWeekManifestLaunch(path.join(OPDS_DIR, fileName), Number(weekMatch[1]));
  }
});

normalizeCatalogLaunches(path.join(OPDS_DIR, "tot2.json"));
