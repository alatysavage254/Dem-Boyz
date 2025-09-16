# Dem-Boyz

Dem-Boyz is a polished, responsive photo gallery web application scaffolded as a lightweight MERN-style monorepo (client + server). The client is a Vite + React app styled with Tailwind CSS. The server is a minimal Express app intended to be extended into a full MERN backend.

This repository contains a working interactive gallery component with thumbnails, fade transitions, autoplay, keyboard navigation, and a lightbox/modal for full-screen viewing.

---

## Features
- Interactive image gallery with click-to-view main image
- Smooth transitions and thumbnail hover effects
- Lightbox modal with Next/Prev and caption display
- Keyboard navigation (← → arrows, Esc to close lightbox)
- Autoplay slideshow (Play/Pause)
- Accessibility: focus states and aria-current on active thumbnails
- Tailwind CSS for utility-first styling
- Vite for fast dev server and production build

## Tech stack
- Client: React 18 + Vite
- Styling: Tailwind CSS 3
- Server: Express (minimal scaffold)
- Package manager: pnpm (workspaces)

## Repository layout

```
Dem-Boyz/
├─ client/            # Vite React app (Tailwind)
├─ server/            # Minimal Express server
├─ img/               # Your original image assets (copy to client/public/img)
├─ package.json       # pnpm workspace root
└─ README.md
```

## Quick start (development)

Requirements:
- Node.js 18+ (LTS)
- pnpm 8+

1. Install dependencies from the repository root:

```bash
pnpm -v
pnpm install
```

2. Copy your images into the client public folder so the React app can load them:

```bash
mkdir -p client/public/img
cp img/* client/public/img/
```

3. Start development (runs client or server separately as needed):

Run client dev server (Vite + Tailwind):

```bash
pnpm --filter client dev
```

Run the Express server:

```bash
pnpm --filter server dev
```

Or run both in parallel using workspace scripts:

```bash
pnpm -w dev
```

Open the client app at the Vite URL (typically http://localhost:5173). The Express server listens on port 5000 by default and provides a sample `/api/ping` endpoint and serves `/img` from `client/public/img`.

## Build for production

Build the client:

```bash
pnpm --filter client build
```

Serve the built client from the Express server (optional):

```bash
# After building client to client/dist
node server/index.js
```

## Extending to full MERN

- Add MongoDB connection (use `MONGODB_URI` env var) and create API routes in `server/` to store image metadata, captions, or user data.
- Protect endpoints with authentication (JWT or sessions) if needed.

## Notes about the nested `copilot/` folder

There is a nested `copilot/` workspace inside this repo that contained its own `.git`. To avoid conflicts when committing from the parent repo, `copilot/` is ignored in `.gitignore`. If you want that project tracked in this repo, you can either:

- Convert it to a submodule (keeps its history):

  ```bash
  git submodule add <url> copilot
  git submodule update --init --recursive
  ```

- Or remove the nested `.git` inside `copilot/` and commit the files into the parent repository (destructive to the nested repo history).

## Gallery notes

- The React gallery component is at `client/src/components/Gallery.jsx` and the lightbox is at `client/src/components/Lightbox.jsx`.
- The list of images is specified in `Gallery.jsx` as an array of objects with `src` and `caption`. You can change these to use a backend API later.

## Troubleshooting
- If you see `fatal: not a git repository` — ensure you run git commands from the repo root or use the `-C` option: `git -C "<repo-root>" status`.
- If git reports `detected dubious ownership`, run: `git config --global --add safe.directory "<repo-path>"`.

## Contributing

Feel free to open issues or send PRs. If you want me to continue, I can:

- Integrate MongoDB and REST endpoints for image metadata
- Add lazy-loading, image optimization, and pagination
- Replace the static images array with an API that serves images from the server

---

If you'd like, I can now add lazy-loading, a fullscreen toggle for the lightbox, or wire the gallery to an API endpoint. Which would you like next?
Dem-Boyz — MERN + Tailwind scaffold (client + server)

Quick start (uses pnpm workspaces):

1. Install dependencies (pnpm must be installed):

   pnpm -v
   pnpm install

2. Move your images into the client public folder so the React app can load them:

   mkdir -p client/public/img
   cp img/* client/public/img/

3. Start development (runs client Vite and server in parallel via pnpm workspace scripts):

   pnpm -w dev

Client (React + Vite + Tailwind):
- The gallery component is at `client/src/components/Gallery.jsx`.
- Lightbox modal and autoplay controls have been added; thumbnails support keyboard navigation and focus states.
- Tailwind is configured via `client/tailwind.config.cjs` and PostCSS.

Server (Express):
 - A minimal server is at `server/index.js` which serves `/img` from `client/public/img` during development and a sample `/api/ping` endpoint.

Notes:
 - After install, run `pnpm -w install`. Tailwind will be processed by Vite when you run the client dev server.
 - If you want to build a real MERN backend, add MongoDB connection logic and API routes in `server`.
