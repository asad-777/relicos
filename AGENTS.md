# AGENTS.md — Relic OS

## Project Overview

Relic OS is a custom browser-based operating system with a retro Game Boy handheld aesthetic. It is a web platform for discovering and playing curated web-based indie games from itch.io, running entirely in the browser. It is not a clone of Windows or any existing OS — it has its own original design language.

**Tagline:** Old soul. New games.
**Target URL:** relicos.gg

---

## Tech Stack

| Layer         | Choice                 | Notes                                                        |
| ------------- | ---------------------- | ------------------------------------------------------------ |
| Framework     | Next.js (App Router)   | All routing via `app/` directory, no `pages/`                |
| Language      | JavaScript             | No TypeScript — plain `.js` and `.jsx` files                 |
| Styling       | Tailwind CSS + DaisyUI | Tailwind for layout/spacing, DaisyUI for base components     |
| UI Components | Shadcn UI & Magic UI   | Shadcn for structural components, Magic UI for animated primitives. Use MCP servers to add them. |
| State         | Zustand                | Lightweight global state for windows, themes, games          |
| Backend       | Next.js Route Handlers | API routes inside `app/api/` — no separate Express server    |
| Database      | PostgreSQL (Supabase)  | Game listings, submission queue                              |
| Hosting       | Vercel                 | Full stack — frontend + API routes in one deployment         |

---

## Project Structure

```
Update this here
```

---

## Routing (App Router)

- `app/page.js` is the entire OS — one page, everything rendered client-side via components
- `app/api/*` are Route Handlers (Next.js App Router API routes) — use `export async function GET/POST(request)` syntax
- This all is supposed to be a single page experience, but we will add some other pages, a simple landing page dashboard, a main os page and a 404 and a doc page, the doc page will have all the documentation, how to use, what features and funcitons and also support forums and feedback forums
- The admin panel can be a hidden route at `app/admin/page.js` protected by a simple password check

---

## Core Systems

### 1. Window Manager

- Every app opens in a draggable, resizable window
- Windows have: title bar, minimize, close, drag handle
- Z-index management — clicking a window brings it to front
- All window state (open, minimized, position, size, z-index) lives in `windowStore.js`
- Components never manage their own window position — always read from the store
- No maximize button — intentional, keeps the handheld feel
- Use `'use client'` directive on all window/desktop components

### 2. Game Directory

- Games stored in DB with: `id`, `title`, `description`, `tags`, `thumbnail`, `embed_url`, `submitted_by`, `status`, `created_at`
- `embed_url` must be the itch.io embed-upload URL format: `https://itch.io/embed-upload/GAME_ID`
- Games launch inside a Window component via `<iframe src={embed_url} />`
- Status field: `pending` | `approved` | `rejected` — only `approved` games are returned by the public API

### 3. Theme System

- DaisyUI 5 themes (defined in `globals.css` via `@plugin "daisyui/theme"`) are the single source of truth for all colors.
- Use standard DaisyUI utility classes (`bg-base-100`, `text-base-content`, `text-primary`, etc.) — do not hardcode hex values in components.
- Preset themes named after Game Boy hardware:
  - **Original** — classic green palette (#9BBC0F bg, #0F380F text)
  - **Pocket** — grayscale (white, mid-gray, dark gray, black)
  - **Color** — vibrant multicolor (purple, teal, yellow accents)
  - **Advance** — dark backlit feel (deep navy, bright accents)
  - **Twilight** — bonus fantasy dark palette
- Custom override: user picks their own hex values for bg, window, border, text, accent
- Active theme + custom overrides saved to `localStorage` via `themeStore.js` — persists between sessions
- Presets are static objects in `lib/themes.js` — never fetched from the backend

### 4. Iframe Apps

- **Games** — itch.io embed-upload URLs only
- **Music** — SoundCloud or similar playlist embed
- **YouTube** — `https://www.youtube.com/embed/VIDEO_ID`
- **Search** — `https://duckduckgo.com/?q=` (DDG allows iframing, Google does not)
- All iframes use `allow="autoplay; fullscreen"`
- Every iframe must have a fallback UI for when the content refuses to embed
- iframes are only mounted when the window is open — unmount on close to stop audio/video

### 5. Boot Sequence

- On first load, `BootScreen.jsx` plays a pixel animation with the Relic OS logo
- Lasts ~3 seconds, skippable on click
- Must not block the main app from loading in the background
- Controlled by a simple `useState` in `app/page.js`

---

## Game Submission Flow

1. User fills out a form: game title, itch.io embed URL, description, tags, contact email
2. Form posts to `POST /api/submit` — saved to DB with `status: pending`
3. Curator reviews in admin panel at `/admin` — tests the game in an iframe preview
4. Curator approves or rejects — status updated via `PATCH /api/admin`
5. Approved games appear live in the directory immediately

**Validation rules (server-side in route handler):**

- `embed_url` must match `https://itch.io/embed-upload/*`
- All required fields must be present and non-empty
- No NSFW content (honor system at submission, curator enforces)
- Game must be web-based and playable without an itch.io login

---

## Styling Rules

- Use **Tailwind** for layout, spacing, and responsive utilities
- Use **DaisyUI** components as a base — but override aggressively to match the retro aesthetic
- DaisyUI 5 themes (`original`, `pocket`, `color`, `advance`, `twilight`) are pre-created in `globals.css` using the `@plugin "daisyui/theme"` syntax. Always use them via standard daisyUI color classes (`bg-base-100`, `text-primary`, etc).
- In global css, standard text sizes and spacing ratios are mapped using the `clamp()` (min, var, max) rule. Always use Tailwind classes like `text-lg` or `p-md` rather than hardcoded pixel values.
- There are two default fonts installed to use, make varibale out of these fonts and use them in `global.css` and in general code where necessary, also pre-map these fonts to stuff like, for the main font, use it for text, paragraph tags, for primary font, pre-map it for headings, links, buttons, etc.
- Use **Magic UI** for animated primitives (text effects, transitions, custom cursors) where it adds to the feel
- Override DaisyUI's default rounded corners — the retro aesthetic uses sharp or minimal radius only
- **No blur, no glassmorphism, no smooth gradients**
- **Fonts:** Local fonts (`primary_font.TTF` for headings, `main_font.ttf` for text) — configured via `next/font/local` in `layout.js` and mapped in `globals.css`
- **Borders:** Hard 2px solid, sharp corners (no more than `rounded-sm` from Tailwind)
- **Shadows:** Offset pixel shadow style — `4px 4px 0px` using the theme's darkest color
- **Icons:** Pixel art style, 16x16 or 32x32, stored in `public/icons/`
- **Animations:** Minimal — cursor blink, window snap, boot sequence only. No framer-motion unless Magic UI uses it internally.

---

## Agent Instructions

### General

- **MCP Servers:** We actively use Supabase, Shadcn, and Magic UI via local MCP servers. You can use these servers to read docs or add components dynamically.
- This is a **JavaScript** project — never generate `.ts` or `.tsx` files
- Always use the **App Router** pattern — no `pages/` directory, no `getServerSideProps`
- API logic goes in `app/api/*/route.js` as Route Handlers, not in a separate server
- Preserve the retro aesthetic at all times — when in doubt, make it sharper and more pixelated, not smoother

### Components

- All interactive components need `'use client'` at the top
- Server components are fine for static layout wrappers and data-fetching shells
- Window components must never manage their own position — always use `windowStore`
- New apps: create component in `components/Apps/`, register in `lib/appRegistry.js`, add icon to desktop

### Styling

- Always use Tailwind utility classes — no inline `style={{}}` unless absolutely necessary (e.g. dynamic theme colors from CSS variables)
- DaisyUI components are a starting point — always check if the default style breaks the retro aesthetic and override if so
- CSS custom properties for theme are set in `globals.css` — components read them via Tailwind's `var()` or directly

### State

- Window state → `windowStore.js`
- Theme state → `themeStore.js`
- No Redux, no Context API for global state — Zustand only
- Local UI state (hover, toggle) can use `useState` inside the component

### API Routes

- Always check `status === 'approved'` before returning games from public endpoints
- Admin routes must verify `ADMIN_API_KEY` from request headers before processing
- Validate all inputs server-side — never trust the client

### Performance

- Lazy load game thumbnails with `next/image`
- Only mount iframes when the window is open
- Boot screen loads independently — never block desktop render
- If user closes a inbuilt app, kill that from the dom to preserve memory

---

## Out of Scope (do not build)

- TypeScript — plain JavaScript only
- User accounts or authentication for players
- Ratings or reviews system
- Game saves or cloud sync
- Mobile responsiveness — desktop browser only for now
- Any AI features
- A separate Express/Node backend — everything runs through Next.js Route Handlers

```

```
