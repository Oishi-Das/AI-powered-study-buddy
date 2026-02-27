# 🛠️ Tech Stack — AI-Powered Study Buddy

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │  HTML5   │  │  CSS3   │  │Vanilla  │  │ Font  │ │
│  │  (SPA)   │  │ Themes  │  │   JS    │  │Awesome│ │
│  └────┬─────┘  └────┬────┘  └────┬────┘  └───┬───┘ │
│       │             │            │            │     │
│       └─────────────┴─────┬──────┴────────────┘     │
│                           │                         │
│                    fetch() API Calls                │
└───────────────────────────┬─────────────────────────┘
                            │
                       HTTP Requests
                      (JSON REST API)
                            │
┌───────────────────────────┴─────────────────────────┐
│                   SERVER (Node.js)                   │
│                                                     │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │  Express.js   │  │   AI Simulation Engine     │   │
│  │  (Routing &   │  │  • Explain  • Summarize   │   │
│  │   Static      │  │  • Quiz     • Flashcards  │   │
│  │   Files)      │  │  • Chat                   │   │
│  └──────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🖥️ Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **HTML5** | — | Semantic markup, single-page app structure |
| **CSS3** | — | Styling, animations, responsive layout |
| **JavaScript** | ES6+ | Modular vanilla JS — no frameworks needed |
| **Google Fonts** | — | Inter (UI text), JetBrains Mono (code) |
| **Font Awesome** | 6.5.1 | 1000+ icons for UI elements |

### CSS Techniques Used
| Technique | Where |
|-----------|-------|
| **CSS Custom Properties** | Theming (dark/light mode, 50+ variables) |
| **Glassmorphism** | Cards, header, chat bubbles (`backdrop-filter: blur`) |
| **CSS Grid** | Level selector, summary stats, layout |
| **Flexbox** | Navigation, chat, flashcard controls |
| **Keyframe Animations** | 20+ animations (orbs, confetti, typing, flip) |
| **CSS Gradients** | Backgrounds, buttons, accent colors |
| **Media Queries** | Responsive breakpoints at 768px & 480px |

### JavaScript Modules
| Module | File | Responsibility |
|--------|------|---------------|
| **App** | `app.js` | Tab routing, theme toggle, streak system, init |
| **API** | `api.js` | REST client — all `fetch()` calls to backend |
| **Utils** | `utils.js` | Markdown→HTML, toasts, confetti, localStorage |
| **Chat** | `chat.js` | Message rendering, typing indicator, suggestions |
| **Explainer** | `explainer.js` | Topic explanation with difficulty levels |
| **Summarizer** | `summarizer.js` | Text compression with stats & key terms |
| **Quiz** | `quiz.js` | Quiz game engine — scoring, progress, results |
| **Flashcards** | `flashcards.js` | 3D flip cards, keyboard nav, spaced repetition |

---

## ⚙️ Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime for the server |
| **Express.js** | 4.18.x | Web framework — routing & static file serving |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/explain` | Generate topic explanation at chosen level |
| `POST` | `/api/summarize` | Summarize text into bullet points + key terms |
| `POST` | `/api/quiz` | Generate multiple-choice quiz questions |
| `POST` | `/api/flashcards` | Generate interactive flashcard sets |
| `POST` | `/api/chat` | Conversational AI chat responses |

### Request/Response Format
All endpoints use **JSON**:
```json
// Request
{ "topic": "Photosynthesis", "level": "simple" }

// Response
{
  "topic": "Photosynthesis",
  "level": "simple",
  "explanation": "...",
  "relatedTopics": ["Advanced Photosynthesis", "..."],
  "estimatedReadTime": "2 min"
}
```

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| 🟣 Accent Primary | `#6c5ce7` | Buttons, links, active states |
| 🟣 Accent Secondary | `#a29bfe` | Highlights, gradients |
| 🩷 Pink | `#fd79a8` | Gradient accents |
| 🟢 Success | `#00b894` | Correct answers, mastered cards |
| 🟡 Warning | `#fdcb6e` | Streak badge, caution states |
| 🔴 Error | `#ff6b6b` | Wrong answers, review cards |
| 🔵 Info | `#74b9ff` | Tips, explanations, info toasts |

### Typography
| Font | Weight | Usage |
|------|--------|-------|
| **Inter** | 300–900 | All UI text |
| **JetBrains Mono** | 400–600 | Code blocks, monospace elements |

### Spacing & Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Buttons, inputs |
| `--radius-lg` | 16px | Cards, bubbles |
| `--radius-xl` | 24px | Main containers |

---

## 📦 Dependencies

### Production
| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| `express` | ^4.18.2 | ~208KB | Web server framework |

### External CDN
| Resource | CDN | Purpose |
|----------|-----|---------|
| Inter font | Google Fonts | UI typography |
| JetBrains Mono | Google Fonts | Monospace typography |
| Font Awesome | cdnjs (6.5.1) | Icon library |

> **Total production dependency: 1 package** — lightweight by design!

---

## 🔧 Development & Running

### Prerequisites
- Node.js v16+
- npm (comes with Node.js)

### Commands
```bash
npm install    # Install dependencies
npm start      # Start server (node server.js)
```

### Local Development
- Server runs on **http://localhost:3000**
- No build step needed — edit files and refresh
- Press **Ctrl+C** to stop the server

---

## 📐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Full support |
| Firefox | 90+ | ✅ Full support |
| Safari | 15+ | ✅ Full support |
| Edge | 88+ | ✅ Full support |
| Mobile Chrome | 88+ | ✅ Responsive |
| Mobile Safari | 15+ | ✅ Responsive |

> Requires `backdrop-filter` support for glassmorphism effects.

---

## 🗂️ File Structure Summary

```
Total files:  14 source files
HTML:          1 file   (index.html)
CSS:           3 files  (styles, animations, components)
JavaScript:    8 files  (app, api, utils, chat, explainer, summarizer, quiz, flashcards)
Server:        1 file   (server.js)
Config:        1 file   (package.json)
Docs:          2 files  (README.md, TECH_STACK.md)
```

---

*Built with simplicity and performance in mind — zero frontend frameworks, one backend dependency.*
