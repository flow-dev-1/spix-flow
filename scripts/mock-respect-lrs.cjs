const http = require("http");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 34197);
const states = new Map();
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Experience-API-Version",
  "Access-Control-Expose-Headers": "X-Experience-API-Version",
};

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
  });
}

function send(res, status, body = "", headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body, null, 2);
  res.writeHead(status, {
    ...corsHeaders,
    "X-Experience-API-Version": "1.0.3",
    ...(payload ? { "Content-Type": "application/json" } : {}),
    ...headers,
  });
  res.end(payload);
}

function sendFile(res, filePath) {
  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 500, { error: "Could not read static file" });
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
}

function serveStatic(url, res) {
  if (!fs.existsSync(distDir)) {
    send(res, 500, { error: "dist folder missing. Run npm run build first." });
    return;
  }

  const requestedPath = decodeURIComponent(url.pathname);
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(distDir, normalizedPath);
  const resolvedPath = path.resolve(filePath);

  if (resolvedPath.startsWith(distDir) && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    sendFile(res, resolvedPath);
    return;
  }

  sendFile(res, path.join(distDir, "index.html"));
}

function stateKey(url) {
  return JSON.stringify({
    activityId: url.searchParams.get("activityId"),
    agent: url.searchParams.get("agent"),
    stateId: url.searchParams.get("stateId"),
    registration: url.searchParams.get("registration"),
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    send(res, 204);
    return;
  }

  if (url.pathname === "/xapi/statements" && req.method === "POST") {
    const raw = await readBody(req);
    let statement = {};
    try {
      statement = JSON.parse(raw || "{}");
    } catch {
      send(res, 400, { error: "Invalid JSON statement" });
      return;
    }

    const verb = statement?.verb?.display?.["en-US"] || statement?.verb?.id || "unknown";
    console.log(`[statement] ${verb}`, JSON.stringify(statement, null, 2));
    send(res, 200, [randomUUID()]);
    return;
  }

  if (url.pathname === "/xapi/activities/state") {
    const key = stateKey(url);

    if (req.method === "GET") {
      if (!states.has(key)) {
        console.log(`[state:get:miss] ${url.searchParams.get("stateId")}`);
        send(res, 404, { error: "State not found" });
        return;
      }

      const value = states.get(key);
      console.log(`[state:get] ${url.searchParams.get("stateId")}`, value);
      send(res, 200, value);
      return;
    }

    if (req.method === "PUT") {
      const raw = await readBody(req);
      let value = {};
      try {
        value = JSON.parse(raw || "{}");
      } catch {
        send(res, 400, { error: "Invalid JSON state" });
        return;
      }

      states.set(key, value);
      console.log(`[state:put] ${url.searchParams.get("stateId")}`, JSON.stringify(value, null, 2));
      send(res, 204);
      return;
    }
  }

  if (req.method === "GET") {
    serveStatic(url, res);
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(port, "127.0.0.1", () => {
  const endpoint = encodeURIComponent(`http://127.0.0.1:${port}/xapi/`);
  const auth = "dXNlcjpwYXNz";
  const actor = encodeURIComponent(
    JSON.stringify({
      objectType: "Agent",
      name: "Amara Test",
      mbox: "mailto:amara@example.com",
    })
  );
  const registration = randomUUID();

  console.log(`Mock RESPECT xAPI LRS listening at http://127.0.0.1:${port}/xapi/`);
  console.log(`Static app serving from ${distDir}`);
  console.log("");
  console.log("Transition:");
  for (let week = 1; week <= 10; week += 1) {
    const activityId = encodeURIComponent(`https://spix.flowonline.app/transition/week${week}/index.html`);
    console.log(
      `Week ${week}: http://127.0.0.1:${port}/transition/week${week}/index.html?endpoint=${endpoint}&auth=${auth}&actor=${actor}&registration=${registration}&activity_id=${activityId}`
    );
  }
  console.log("");
  console.log("Transition 2:");
  for (let week = 1; week <= 5; week += 1) {
    const activityId = encodeURIComponent(`https://spix.flowonline.app/transition2/week${week}/index.html`);
    console.log(
      `Week ${week}: http://127.0.0.1:${port}/transition2/week${week}/index.html?endpoint=${endpoint}&auth=${auth}&actor=${actor}&registration=${registration}&activity_id=${activityId}`
    );
  }
  console.log("");
  console.log("TOT2:");
  for (let week = 1; week <= 5; week += 1) {
    const activityId = encodeURIComponent(`https://spix.flowonline.app/tot2/week${week}/index.html`);
    console.log(
      `Week ${week}: http://127.0.0.1:${port}/tot2/week${week}/index.html?endpoint=${endpoint}&auth=${auth}&actor=${actor}&registration=${registration}&activity_id=${activityId}`
    );
  }
  console.log("");
  console.log("TOT:");
  for (let week = 1; week <= 6; week += 1) {
    const activityId = encodeURIComponent(`https://spix.flowonline.app/tot/week${week}/index.html`);
    console.log(
      `Week ${week}: http://127.0.0.1:${port}/tot/week${week}/index.html?endpoint=${endpoint}&auth=${auth}&actor=${actor}&registration=${registration}&activity_id=${activityId}`
    );
  }
});
