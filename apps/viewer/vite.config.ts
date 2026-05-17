/// <reference types="vitest/config" />
import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const REPO_ROOT = path.resolve(dirname, "../..");

// Serve corpus files (everything under the parent repo, except apps/viewer
// itself) at /corpus/<path>. We don't symlink into /public/ because vite
// copies that recursively at build time, which would loop on the symlink.
function corpusPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    if (!req.url || !req.url.startsWith("/corpus/")) return next();
    let rel = decodeURIComponent(req.url.slice("/corpus/".length).split("?")[0]);
    if (rel.includes("..")) {
      res.statusCode = 400;
      return res.end("bad path");
    }
    if (rel.startsWith("apps/viewer/")) {
      res.statusCode = 403;
      return res.end("forbidden");
    }
    const abs = path.join(REPO_ROOT, rel);
    try {
      const s = await stat(abs);
      if (!s.isFile()) {
        res.statusCode = 404;
        return res.end("not file");
      }
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
    }
  };
}
export default defineConfig({
  // Relative base so the build works at any deploy path (site root or
  // /repo/ sub-path on GitHub project pages). For dev/preview this still
  // resolves correctly because import.meta.env.BASE_URL is "/" only when
  // base is explicitly "/".
  base: "./",
  plugins: [react(), corpusPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src")
    }
  },
  // allowedHosts: true so an ngrok tunnel works out of the box.
  // host: true binds 0.0.0.0 so the tunnel can reach the dev server.
  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: true
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
