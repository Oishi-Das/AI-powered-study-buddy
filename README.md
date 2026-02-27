# 🧠 AI-Powered Study Buddy

> Your intelligent study companion that explains topics, summarizes notes, generates quizzes, and creates flashcards on demand.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Conversational study assistant that answers questions naturally |
| 💡 **Topic Explainer** | Get clear explanations at Simple, Intermediate, or Advanced levels |
| 📝 **Note Summarizer** | Paste long notes and get concise bullet-point summaries |
| ❓ **Quiz Generator** | Auto-generated multiple-choice quizzes with explanations |
| 🃏 **Flashcard Creator** | Interactive flip cards with spaced repetition tracking |
| 🔥 **Study Streak** | Gamified streak counter to keep you motivated |
| 🌙 **Dark/Light Mode** | Beautiful themes with glassmorphism design |
| ✨ **Animations** | Smooth transitions, confetti celebrations, and typing effects |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or later

### Installation

```bash
# 1. Navigate to the project folder
cd "AI-powered study buddy"

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

### Open in Browser
Visit **http://localhost:3000** and start studying! 🎓

---

## 📁 Project Structure

```
AI-powered study buddy/
├── server.js                  # Express backend with AI simulation
├── package.json               # Project configuration
├── README.md                  # This file
└── public/
    ├── index.html             # Main HTML (single-page app)
    ├── css/
    │   ├── styles.css         # Core styles, layout, themes
    │   ├── animations.css     # All keyframe animations
    │   └── components.css     # Chat, quiz, flashcard components
    └── js/
        ├── app.js             # Main app controller & initialization
        ├── api.js             # API client for backend calls
        ├── utils.js           # Markdown parser, toasts, helpers
        ├── chat.js            # Chat module
        ├── explainer.js       # Topic explainer module
        ├── summarizer.js      # Note summarizer module
        ├── quiz.js            # Quiz generator & game logic
        └── flashcards.js      # Flashcard generator & flip logic
```

---

## 🎨 Design Highlights

- **Glassmorphism UI** — Frosted glass effects with backdrop blur
- **Animated Orb Background** — Floating gradient orbs with grid overlay
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Micro-interactions** — Hover effects, transitions, and celebrations
- **Accessible** — Keyboard navigation support for flashcards

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Design | CSS Grid, Flexbox, CSS Custom Properties |
| Effects | CSS Animations, Glassmorphism, Gradients |
| Icons | Font Awesome 6 |
| Fonts | Inter, JetBrains Mono (Google Fonts) |

---

## 📄 License

MIT License — feel free to use and modify for your projects!
