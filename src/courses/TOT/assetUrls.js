const assets = import.meta.glob("/src/assets/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export function getAssetUrl(path) {
  return assets[`/src/assets/${path}`] || "";
}
