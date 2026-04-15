import { courseContent } from "../data/activity";

type WeekKey = keyof typeof courseContent;

/** Recursively extract all videoSrc strings from any nested object/array */
function extractVideoSrcs(node: unknown): string[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(extractVideoSrcs);
  const obj = node as Record<string, unknown>;
  const srcs: string[] = [];
  if (typeof obj.videoSrc === "string") srcs.push(obj.videoSrc);
  for (const key of Object.keys(obj)) {
    if (key !== "videoSrc") srcs.push(...extractVideoSrcs(obj[key]));
  }
  return srcs;
}

/** Returns all unique video URLs for a given week number (1-based) */
export function getWeekVideoUrls(weekNumber: number): string[] {
  const key = `week${weekNumber}` as WeekKey;
  const weekData = courseContent[key];
  if (!weekData) return [];
  const srcs = extractVideoSrcs(weekData);
  return [...new Set(srcs)];
}

/** Derive a filename from a CloudFront video URL */
export function videoFilename(url: string, index: number, weekNumber: number): string {
  try {
    const pathname = new URL(url).pathname;
    const raw = decodeURIComponent(pathname.split("/").pop() ?? "");
    return raw || `Week${weekNumber}_${index + 1}.mp4`;
  } catch {
    return `Week${weekNumber}_${index + 1}.mp4`;
  }
}
