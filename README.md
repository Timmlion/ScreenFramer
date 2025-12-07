# ScreenFramer (Screenshot Beautifier)

**ScreenFramer** is a privacy-first, client-side tool designed to transform your raw screenshots into aesthetic, social-media-ready images. Add stylish backgrounds, elegant window frames, and fine-tune details without watermarks, directly in your browser.

> **⚡ Vibe Coded** – Built in pure flow with AI assistance.

![ScreenFramer Screenshot](https://via.placeholder.com/800x400?text=ScreenFramer+Screenshot)

## 🚀 Features

*   **Image Import:** Seamlessly upload screenshots via Drag & Drop, Paste from clipboard (Ctrl+V), or traditional file selection.
*   **Live Preview:** Instantly see your changes with a real-time, high-fidelity preview.
*   **Customizable Backgrounds:** Choose from solid colors or a selection of beautiful gradient presets.
*   **Window Chrome:** Frame your screenshots with elegant macOS (Dark/Light) or Windows-style title bars, or go frameless.
*   **Fine-tuned Adjustments:** Control padding, corner radius, and shadow intensity with intuitive sliders.
*   **Aspect Ratio Control:** Optimize your output for social media with a dropdown for common aspect ratios (e.g., 16:9, 1:1, 4:5).
*   **Privacy-First:** All processing happens in your browser; no images are ever uploaded to a server.
*   **High-Quality Export:** Download your beautified screenshot as a crisp, high-resolution PNG image (2x scaling for Retina displays).
*   **Dark Mode:** Modern, dark-themed UI powered by Tailwind CSS v4.

## 🛠️ Tech Stack

*   **Frontend:** React 19 + Vite
*   **Styling:** Tailwind CSS v4
*   **Image Export:** `html-to-image`
*   **Icons:** `lucide-react`
*   **Color Picker:** `react-colorful`
*   **Utility:** `clsx`, `tailwind-merge`

## 📦 How to run locally?

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## 🚢 Build & Deploy (Coolify/Vercel)

This is a static SPA. To build for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## ☕ Support

If this tool saved you some time, consider supporting the development!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/adamsiwek)
