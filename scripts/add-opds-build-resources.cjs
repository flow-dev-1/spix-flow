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

const courses = [
  { slug: "tot", weeks: 6 },
  { slug: "tot2", weeks: 5 },
  { slug: "transition", weeks: 10 },
  { slug: "transition2", weeks: 5 },
];

const weekHtmlResources = [];
for (const course of courses) {
  for (let week = 1; week <= course.weeks; week += 1) {
    weekHtmlResources.push(resource("/" + course.slug + "/week" + week, "text/html"));
    weekHtmlResources.push(resource("/" + course.slug + "/week" + week + "/", "text/html"));
    weekHtmlResources.push(resource("/" + course.slug + "/week" + week + "/index.html", "text/html"));
    weekHtmlResources.push(resource("/" + course.slug + "?startWeek=" + week, "text/html"));
  }
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

const serviceWorkerResource = resource("/sw.js", "text/javascript");
const serviceWorkerLink = {
  rel: "serviceworker",
  href: serviceWorkerResource.href,
  type: serviceWorkerResource.type,
};

function addServiceWorkerLink(manifestPath) {
  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const existing = new Set(
    (manifest.links || []).map((item) => item.rel + "|" + item.href),
  );

  if (!existing.has(serviceWorkerLink.rel + "|" + serviceWorkerLink.href)) {
    manifest.links = (manifest.links || []).concat(serviceWorkerLink);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }
}

const builtFileResources = [
  resource("/index.html", "text/html"),
  resource("/tot", "text/html"),
  resource("/tot/", "text/html"),
  resource("/tot2", "text/html"),
  resource("/tot2/", "text/html"),
  resource("/transition", "text/html"),
  resource("/transition/", "text/html"),
  resource("/transition2", "text/html"),
  resource("/transition2/", "text/html"),
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
for (const course of courses) {
  for (let week = 1; week <= course.weeks; week += 1) {
    relativeWeekResources.push(relativeResource("../" + course.slug + "/week" + week, "text/html"));
    relativeWeekResources.push(relativeResource("../" + course.slug + "/week" + week + "/", "text/html"));
    relativeWeekResources.push(relativeResource("../" + course.slug + "/week" + week + "/index.html", "text/html"));
    relativeWeekResources.push(relativeResource("../" + course.slug + "?startWeek=" + week, "text/html"));
  }
}

const relativeBuiltFileResources = [
  relativeResource("../index.html", "text/html"),
  relativeResource("../tot", "text/html"),
  relativeResource("../tot/", "text/html"),
  relativeResource("../tot2", "text/html"),
  relativeResource("../tot2/", "text/html"),
  relativeResource("../transition", "text/html"),
  relativeResource("../transition/", "text/html"),
  relativeResource("../transition2", "text/html"),
  relativeResource("../transition2/", "text/html"),
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
  for (const course of courses) {
    for (let week = 1; week <= course.weeks; week += 1) {
      const launcherPath = path.join(DIST_DIR, course.slug, "week" + week, "index.html");
      fs.mkdirSync(path.dirname(launcherPath), { recursive: true });
      fs.writeFileSync(launcherPath, appShell);
    }
  }
}

copyAppShellToWeekLaunchers();

const OPEN_ACCESS_REL = "http://opds-spec.org/acquisition/open-access";

function weekLaunchLinks(slug, week) {
  return [
    resource("/" + slug + "/week" + week + "/index.html", "text/html"),
    resource("/" + slug + "/week" + week + "/", "text/html"),
    resource("/" + slug + "/week" + week, "text/html"),
    resource("/" + slug + "?startWeek=" + week, "text/html"),
  ].map((item) => ({
    rel: OPEN_ACCESS_REL,
    href: item.href,
    type: item.type,
  }));
}

function normalizeWeekManifestLaunch(manifestPath, slug, week) {
  if (!fs.existsSync(manifestPath)) return;

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.metadata = manifest.metadata || {};
  manifest.metadata.identifier = APP_ORIGIN + "/" + slug + "/week" + week + "/index.html";
  manifest.links = (manifest.links || [])
    .filter((link) => link.rel !== OPEN_ACCESS_REL)
    .concat(weekLaunchLinks(slug, week));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

function normalizeCatalogLaunches(catalogPath, slug) {
  if (!fs.existsSync(catalogPath)) return;

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  for (const publication of catalog.publications || []) {
    const currentIdentifier = publication.metadata && publication.metadata.identifier;
    const match = currentIdentifier && currentIdentifier.match(/\/week(\d+)(?:\/index\.html)?\/?$/);
    if (!match) continue;

    const week = Number(match[1]);
    publication.metadata.identifier = APP_ORIGIN + "/" + slug + "/week" + week + "/index.html";
    publication.links = (publication.links || [])
      .filter((link) => link.rel !== OPEN_ACCESS_REL)
      .concat(weekLaunchLinks(slug, week));
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
}

[
  "tot-manifest.json",
  "tot-week1-manifest.json",
  "tot-week2-manifest.json",
  "tot-week3-manifest.json",
  "tot-week4-manifest.json",
  "tot-week5-manifest.json",
  "tot-week6-manifest.json",
  "tot2-manifest.json",
  "tot2-week1-manifest.json",
  "tot2-week2-manifest.json",
  "tot2-week3-manifest.json",
  "tot2-week4-manifest.json",
  "tot2-week5-manifest.json",
  "transition-manifest.json",
  "transition-week1-manifest.json",
  "transition-week2-manifest.json",
  "transition-week3-manifest.json",
  "transition-week4-manifest.json",
  "transition-week5-manifest.json",
  "transition-week6-manifest.json",
  "transition-week7-manifest.json",
  "transition-week8-manifest.json",
  "transition-week9-manifest.json",
  "transition-week10-manifest.json",
  "transition2-manifest.json",
  "transition2-week1-manifest.json",
  "transition2-week2-manifest.json",
  "transition2-week3-manifest.json",
  "transition2-week4-manifest.json",
  "transition2-week5-manifest.json",
].forEach((fileName) => {
  addResources(path.join(OPDS_DIR, fileName), [serviceWorkerResource].concat(sharedResources));
  addServiceWorkerLink(path.join(OPDS_DIR, fileName));
  addRelativeResourcesToWebpub(path.join(OPDS_DIR, fileName));

  const weekMatch = fileName.match(/week(\d+)/);
  if (weekMatch) {
    const slug = fileName.startsWith("transition2")
      ? "transition2"
      : fileName.startsWith("transition")
      ? "transition"
      : fileName.startsWith("tot2")
        ? "tot2"
        : "tot";

    normalizeWeekManifestLaunch(
      path.join(OPDS_DIR, fileName),
      slug,
      Number(weekMatch[1]),
    );
  }
});

normalizeCatalogLaunches(path.join(OPDS_DIR, "tot.json"), "tot");
normalizeCatalogLaunches(path.join(OPDS_DIR, "tot2.json"), "tot2");
normalizeCatalogLaunches(path.join(OPDS_DIR, "transition.json"), "transition");
normalizeCatalogLaunches(path.join(OPDS_DIR, "transition2.json"), "transition2");
