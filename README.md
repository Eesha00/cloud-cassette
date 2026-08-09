# ☁️📼 Cloud Cassette

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A cozy, retro-inspired lo-fi radio web application designed for deep focus and relaxation. Cloud Cassette combines curated music streams with synchronized looping visuals, an independent ambient noise mixer, and a built-in Pomodoro productivity timer—all wrapped in a responsive 16-bit pastel aesthetic.

## ✨ Features

*   **Curated Lo-Fi Stations:** 10+ distinct radio stations featuring synchronized, looping pixel-art video backgrounds.
*   **Ambient Sound Mixer:** Layer independent, volume-controlled ambient tracks (Rain 🌧️, Crickets 🦗, Fireplace 🔥) over the music.
*   **Integrated Pomodoro Timer:** Focus and break intervals with classic (25/5), deep work (50/10), or fully custom durations. Features visual SVG progress rings and audio chimes.
*   **Dynamic Responsive UI:** A floating, draggable interface with a unified desktop dock and a collapsible mobile action rail.
*   **Retro Aesthetic:** High-quality CSS styling featuring custom font stacks (Fredoka, Silkscreen, VT323), film grain overlays, SVG noise filters, and chained box-shadows to eliminate sub-pixel rendering gaps.

## 🛠️ Tech Stack

**Core Languages**
*   JavaScript (ES6+) / JSX
*   CSS3
*   HTML5

**Frameworks & Libraries**
*   **React 18 + Vite:** Core UI rendering and lightning-fast build tooling.
*   **Tailwind CSS:** Utility-first styling combined with custom CSS modules for complex, unified animations.
*   **Zustand:** Lightweight global state management for audio volumes, timer logic, and active station state.
*   **Framer Motion:** Declarative physics-based animations and layout transitions.
*   **Lucide React:** Clean, customizable vector iconography.

## 🚀 Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/cloud-cassette.git](https://github.com/yourusername/cloud-cassette.git)
    cd cloud-cassette
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    Vite is configured to automatically open your default browser.
    ```bash
    npm run dev
    ```

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Spacebar` | Play / Pause current station |
| `↑` / `↓` | Switch to the next / previous station |
| `H` | Toggle UI visibility (Hide/Show) |

## 📁 Key File Structure

*   `src/store/useStore.js`: Global Zustand store handling audio volumes, timer logic, and active station state.
*   `src/components/BottomDock.jsx`: The primary responsive playback and navigation controller.
*   `src/components/modals/`: Contains the UI layers for `AmbientModal.jsx` and `TimerModal.jsx`.
*   `src/components/Splash.jsx`: Animated entry screen forcing user interaction to bypass browser auto-play restrictions.

---
*Built by Eesha Amir.*

## License

Distributed under the MIT License. See `LICENSE` for more information.
