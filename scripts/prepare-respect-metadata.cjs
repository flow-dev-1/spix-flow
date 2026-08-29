const fs = require("fs");
const path = require("path");

const APP_ORIGIN = "https://spix.flowonline.app";
const OPDS_DIR = path.resolve("public", "opds");
const APP_MANIFEST_PATH = path.resolve("public", "launchable-app.json");
const LEGACY_APP_MANIFEST_PATH = path.resolve("public", "respect-manifest.json");
const APP_MANIFEST_URL = `${APP_ORIGIN}/launchable-app.json`;
const DEFAULT_COLLECTION_URL = `${APP_ORIGIN}/opds/index.json`;
const TINCAN_REL = "https://id.openeel.org/rel/tincanxml";
const APP_REL = "https://id.openeel.org/rel/launchable-app";

const courses = [
  { slug: "tot", catalog: "tot.json", weeks: 6, subject: "Education" },
  { slug: "tot2", catalog: "tot2.json", weeks: 5, subject: "Education" },
  { slug: "transition", catalog: "transition.json", weeks: 10, subject: "Life Skills" },
  { slug: "transition2", catalog: "transition2.json", weeks: 5, subject: "Life Skills" },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceLink(links, rel, link) {
  return (links || []).filter((item) => item.rel !== rel).concat(link);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const appManifest = {
  metadata: {
    "@type": "https://id.openeel.org/schema/launchable-app",
    title: "SPIX - Flow Online Learning",
    author: {
      name: "Flow Online Learning",
    },
    identifier: `${APP_ORIGIN}/app`,
    language: "en",
    modified: "2026-08-29T00:00:00Z",
  },
  links: [
    {
      rel: "self",
      href: APP_MANIFEST_URL,
      type: "application/opds-publication+json",
    },
    {
      rel: "collection",
      href: DEFAULT_COLLECTION_URL,
      type: "application/opds+json",
    },
    {
      rel: "https://id.openeel.org/rel/app-launch-uri",
      href: APP_ORIGIN,
    },
    {
      rel: "license",
      href: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    },
  ],
  images: [
    { href: `${APP_ORIGIN}/FLOW.png`, type: "image/png" },
  ],
};

writeJson(APP_MANIFEST_PATH, appManifest);
writeJson(LEGACY_APP_MANIFEST_PATH, appManifest);

const allPublications = [];

for (const course of courses) {
  const catalogPath = path.join(OPDS_DIR, course.catalog);
  const catalog = readJson(catalogPath);

  for (let week = 1; week <= course.weeks; week += 1) {
    const publication = catalog.publications?.[week - 1];
    if (!publication) {
      throw new Error(`Missing ${course.slug} week ${week} publication`);
    }

    const manifestName = `${course.slug}-week${week}-manifest.json`;
    const manifestPath = path.join(OPDS_DIR, manifestName);
    const manifestUrl = `${APP_ORIGIN}/opds/${manifestName}`;
    const tincanName = `${course.slug}-week${week}-tincan.xml`;
    const tincanUrl = `${APP_ORIGIN}/opds/${tincanName}`;
    const launchUrl = `${APP_ORIGIN}/${course.slug}/week${week}/index.html`;
    const activityId = launchUrl;

    publication.metadata = publication.metadata || {};
    publication.metadata.identifier = activityId;
    if (!publication.metadata["@type"]) {
      publication.metadata["@type"] = "http://schema.org/Course";
    }
    if (!publication.metadata.author) {
      publication.metadata.author = "Flow Online Learning";
    }
    if (!publication.metadata.subject) {
      publication.metadata.subject = [
        { name: course.subject, scheme: "https://www.bisg.org/#bisac", code: "EDU000000" },
      ];
    }

    // Keep only the index.html acquisition link (matches RESPECT reference format)
    publication.links = (publication.links || []).filter(
      (l) => l.rel !== "http://opds-spec.org/acquisition/open-access"
    );
    publication.links.push({
      rel: "http://opds-spec.org/acquisition/open-access",
      href: launchUrl,
      type: "text/html",
    });

    // Normalize images to only href and type
    if (publication.images) {
      publication.images = publication.images.map((img) => ({
        href: img.href,
        type: img.type,
      }));
    }

    publication.links = replaceLink(publication.links, "self", {
      rel: "self",
      href: manifestUrl,
      type: "application/opds-publication+json",
    });
    publication.links = replaceLink(publication.links, TINCAN_REL, {
      rel: TINCAN_REL,
      href: tincanUrl,
      type: "application/xml",
    });
    publication.links = replaceLink(publication.links, APP_REL, {
      rel: APP_REL,
      href: APP_MANIFEST_URL,
      type: "application/opds-publication+json",
    });

    const manifest = readJson(manifestPath);
    manifest.metadata = manifest.metadata || {};
    manifest.metadata.identifier = activityId;
    manifest.links = replaceLink(manifest.links, "self", {
      rel: "self",
      href: manifestUrl,
      type: "application/opds-publication+json",
    });
    manifest.links = replaceLink(manifest.links, TINCAN_REL, {
      rel: TINCAN_REL,
      href: tincanUrl,
      type: "application/xml",
    });
    manifest.links = replaceLink(manifest.links, APP_REL, {
      rel: APP_REL,
      href: APP_MANIFEST_URL,
      type: "application/opds-publication+json",
    });
    manifest.readingOrder = [{ href: launchUrl, type: "text/html" }];
    writeJson(manifestPath, manifest);

    const title = publication.metadata.title || `${course.slug} week ${week}`;
    const description = publication.metadata.description || title;
    const tincan = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<tincan xmlns="http://projecttincan.com/tincan.xsd">\n` +
      `  <activities>\n` +
      `    <activity id="${escapeXml(activityId)}" type="http://adlnet.gov/expapi/activities/lesson">\n` +
      `      <name>${escapeXml(title)}</name>\n` +
      `      <description lang="en-US">${escapeXml(description)}</description>\n` +
      `      <launch lang="en-US">../${course.slug}/week${week}/index.html</launch>\n` +
      `    </activity>\n` +
      `  </activities>\n` +
      `</tincan>\n`;
    fs.writeFileSync(path.join(OPDS_DIR, tincanName), tincan);

    allPublications.push(publication);
  }

  writeJson(catalogPath, catalog);
}

writeJson(path.join(OPDS_DIR, "index.json"), {
  metadata: { title: "SPIX - Flow Online Learning Courses" },
  links: [
    { rel: "self", href: DEFAULT_COLLECTION_URL, type: "application/opds+json" },
  ],
  publications: allPublications,
});

console.log(`Prepared RESPECT metadata for ${allPublications.length} learning units.`);
