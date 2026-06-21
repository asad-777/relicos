# Relic OS

Relic OS is a browser-based operating system interface. It functions as a web platform for discovering and playing web-based indie games from itch.io, while simulating a complete desktop environment with a retro aesthetic.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS, DaisyUI
- **State Management:** Zustand
- **Database:** PostgreSQL (Supabase)
- **Hosting:** Vercel

## Operating System Features

Relic OS provides a simulated desktop experience entirely within the browser. 

### Desktop Environment
- **Window Management:** Applications open in isolated, draggable, and resizable window containers. The system manages z-index ordering to bring active windows to the front.
- **Top Navigation Bar:** Displays system status, current time, and active application controls.
- **App Launcher / Dock:** A persistent menu for launching installed applications.
- **Context Menus:** Right-click functionality on the desktop and icons for quick actions like changing themes or arranging icons.
- **Pop-ups and Control Center:** Quick access overlays for adjusting system volume, toggling mute, viewing the calendar, and system notifications.

### Built-in Applications
- **Game Directory:** The core application that fetches curated indie games from a Supabase database. Games are loaded via itch.io embed URLs and rendered securely inside iframes within the window containers.
- **Web Browsing:** A rudimentary browser app that uses DuckDuckGo for search, loading web pages through iframes.
- **YouTube App:** Accepts YouTube URLs or video IDs and embeds the standard YouTube video player directly onto the desktop.
- **Music Player:** A system-integrated audio player. It features scrubbing, track skipping, and interacts with global system audio states.
- **Calculator & Widgets:** Basic utilities including a calculator and desktop widgets like weather or clocks.

### Theme System
The visual style is managed via DaisyUI themes defined in `globals.css`. 
- Includes preset hardware-inspired palettes (Original, Pocket, Color, Advance, Twilight).
- Supports user-defined custom themes via hex value overrides for background, window borders, text, and accents.
- Theme configurations are stored in `localStorage` and persist between sessions.

## System Architecture

- **State Management:** Zustand stores manage global states such as window positions, active theme, system volume, and music playback.
- **Iframe Integration:** External content (games, YouTube, web browsing) relies on standard HTML iframes, configured with necessary permissions like autoplay and fullscreen. 
- **Submission API:** Next.js Route Handlers validate and process new game submissions, requiring specific itch.io embed URL formats before saving to the database.

## Directory Structure

- `src/app/`: Next.js App Router setup, API routes, and main layout.
- `src/components/OS/`: Core desktop components including `Desktop`, `TopBar`, `Window`, `ContextMenu`, and `ControlCenter`.
- `src/components/Apps/`: Inbuilt application components (`BrowserApp`, `YoutubeApp`, `GameDirectory`, `MusicPlayer`, etc.).
- `src/components/Widgets/`: Draggable desktop widgets.
- `src/lib/stores/`: Zustand state stores.
- `src/lib/`: Registries for applications and widgets.

## Development Setup

### Prerequisites

- Node.js
- Package manager (npm, pnpm, or yarn)
- Supabase project and database

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.
