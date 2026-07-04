# ZXEQzzg Csy Portfolio

Personal resume and project portfolio site for GitHub Pages.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Content Editing

Public visitors see the portfolio at `/`.

The content editor lives at `/#admin`. It is hidden from the public navigation and currently saves drafts to the browser's local storage. To publish changes, copy the exported JSON into `src/data/siteContent.ts` or connect the editor to GitHub API later.

Because this is a static GitHub Pages site, a hidden editor route is not real access control. True private publishing should be added with GitHub authentication, Decap CMS, TinaCMS, or a small GitHub API writer service.

## Deployment

The included GitHub Actions workflow builds the Vite app and publishes `dist` to GitHub Pages on pushes to `main`.
# Deployment trigger
