# ClipHistory ✂️

A web-based clipboard history manager built with Next.js, Zustand, and Tailwind CSS.

## Features

- **Paste to capture** — Ctrl+V anywhere captures text to history
- **Search** — Filter clips by text or tags
- **Pin** — Keep important clips at the top
- **Tag** — Organize clips with custom labels
- **Quick copy** — Click any clip to copy it back
- **Keyboard-first** — ↑↓ navigate, Enter copy, / search, Delete remove
- **Export** — Download history as JSON
- **Dark/Light mode** — Toggle themes
- **Stats** — Total clips, today's count, top tags
- **100-clip history** — Auto-managed, stored in localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `↑` `↓` | Navigate clips |
| `Enter` | Copy selected clip |
| `Delete` / `Backspace` | Remove selected clip |
| `Escape` | Clear search / unfocus |
| `Ctrl+V` | Capture clipboard text |

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) (state + persistence)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Lucide React](https://lucide.dev/) (icons)
- [date-fns](https://date-fns.org/) (time formatting)

## License

MIT — see [LICENSE](LICENSE)
