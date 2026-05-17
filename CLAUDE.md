# Repo notes for Claude

## Deploying the viewer to GitHub Pages

The viewer (`apps/viewer/`) is published as a static site in a separate public
repo: **`kiyoon/ielts-feedback-site`** → served at
`http://kiyoon.kim/ielts-feedback-site/`.

The local clone of that artifacts repo lives **inside** `apps/viewer/dist/`
(its own `.git/`; `dist/` is gitignored by this repo, so it never shows up in
`git status`). `vite build` rewrites the files in `dist/` on every build but
leaves `.git/` alone.

### What makes the build deployable

- `apps/viewer/scripts/copy-corpus.mjs` runs as `prebuild` and copies `.md`
  files from `contexts/`, `real-essays/`, `real-essays/feedback/`,
  `benchmark/essays/`, and `benchmark/results/` into `public/corpus/`. This
  materialises what the Vite `corpusPlugin` middleware serves dynamically in
  dev — without it, `CitationSheet` 404s in production. If a new top-level
  corpus folder gets cited by feedback, extend the `SOURCES` array in that
  script.
- `apps/viewer/vite.config.ts` sets `base: "./"` so assets resolve under any
  sub-path.
- `apps/viewer/src/lib/data.ts` builds fetch URLs from
  `import.meta.env.BASE_URL`, so the same build works whether served at site
  root or under `/ielts-feedback-site/`.

### Redeploy after data or code changes

```bash
cd apps/viewer
bun run build                # regenerates dist/ (copy-corpus + vite build)
cd dist
git add .
git commit -m "update"       # commit signing is disabled in this clone
git push                     # → kiyoon/ielts-feedback-site main
```

GitHub Pages rebuilds within ~1 minute. No GitHub Action is wired up — push
is manual.

### Local dev tunnel

For sharing the live dev server (not the static build) over the named
Cloudflare tunnel at `ielts.kiyoonkim.com`:

```bash
cd apps/viewer
bun dev & cloudflared tunnel run d345b5ff-14a7-4e65-ac1c-ea1633fd4161
```

The tunnel config in `~/.cloudflared/config.yml` routes that hostname to
`127.0.0.1:5173`.
