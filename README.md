# Wian Mostert Portfolio

React + Vite portfolio for Wian Mostert's film work. The site is built for GitHub Pages at `/PortfolioWebsite/`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/PortfolioWebsite/`.

## Admin Page

The hidden editing screen is available at `/PortfolioWebsite/admin`.

- Default local password: `wian-admin-2026`
- The admin page edits public portfolio settings in browser `localStorage`.
- Use Export to download the JSON config before moving edits into source control.
- Use Import to preview a previously exported config.
- Image upload fields convert selected images to browser-local data URLs and include them in exported JSON.
- Film thumbnails use a custom uploaded image or URL when present. If the custom thumbnail is blank or cleared, the site falls back to the default YouTube thumbnail.
- Google Drive image share links are supported when the Drive file is set to `Anyone with the link` as a viewer. Paste the normal Drive share link and the admin page converts it automatically.
- Preview saves the current admin draft locally before opening the public site.
- Use Reset saved local config to clear browser-only overrides.

For a custom password, generate a SHA-256 hash and set it in `.env`:

```bash
VITE_ADMIN_PASSWORD_HASH=your_sha256_hash_here
```

Security note: this is a static GitHub Pages site, so the password protects only the local admin UI. It is not a backend permission system and must not be used for private data or secrets.

Image note: uploaded raster images are compressed before being saved in browser storage. For permanent public assets, add optimized image files to `public/` and use their URLs, or connect a backend/storage provider later.

## Configuration

Code-level defaults live in:

- `src/config/portfolio.ts` for profile defaults, storage keys, and override helpers.
- `src/data/projects.ts` for canonical YouTube project metadata and default per-film themes.

## Build

```bash
npm run lint
npm run build
```
