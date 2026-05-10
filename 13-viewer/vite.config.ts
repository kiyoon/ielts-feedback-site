import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

const REPO_ROOT = path.resolve(__dirname, "..");

// Serve corpus files (everything under the parent repo, except 13-viewer
// itself) at /corpus/<path>. We don't symlink into /public/ because vite
// copies that recursively at build time, which would loop on the symlink.
function corpusPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (!req.url || !req.url.startsWith("/corpus/")) return next();
    let rel = decodeURIComponent(req.url.slice("/corpus/".length).split("?")[0]);
    if (rel.includes("..")) { res.statusCode = 400; return res.end("bad path"); }
    if (rel.startsWith("13-viewer/")) { res.statusCode = 403; return res.end("forbidden"); }
    const abs = path.join(REPO_ROOT, rel);
    try {
      const s = await stat(abs);
      if (!s.isFile()) { res.statusCode = 404; return res.end("not file"); }
      const buf = await readFile(abs);
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.end(buf);
    } catch {
      res.statusCode = 404;
      res.end("not found");
    }
  };
  return {
    name: "ielts-corpus-middleware",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), corpusPlugin()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: { port: 5173, host: "127.0.0.1" },
});
