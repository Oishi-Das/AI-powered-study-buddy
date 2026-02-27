const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ── AI Simulation Endpoints ──────────────────────────────────────────

// Explain a topic
app.post('/api/explain', (req, res) => {
  const { topic, level } = req.body;
  const explanations = generateExplanation(topic, level);
  res.json(explanations);
});

// Summarize notes
app.post('/api/summarize', (req, res) => {
  const { text } = req.body;
  const summary = generateSummary(text);
  res.json(summary);
});

// Generate quiz
app.post('/api/quiz', (req, res) => {
  const { topic, count } = req.body;
  const quiz = generateQuiz(topic, count);
  res.json(quiz);
});

// Generate flashcards
app.post('/api/flashcards', (req, res) => {
  const { topic, count } = req.body;
  const flashcards = generateFlashcards(topic, count);
  res.json(flashcards);
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, history } = req.body;
  const reply = generateChatReply(message, history);
  res.json(reply);
});

// ── AI Simulation Functions ──────────────────────────────────────────

function generateExplanation(topic, level) {
  const t = topic.toLowerCase();
  const explanations = {
    simple: {
      default: `Let me explain **${topic}** in simple terms:\n\n` +
        `Think of ${topic} like a recipe 🍳. Just as a recipe has step-by-step instructions to make a dish, ${topic} follows a structured approach to achieve its goal.\n\n` +
        `**Key Points:**\n` +
        `• It's a fundamental concept that builds on basic principles\n` +
        `• You can think of it as connecting simple ideas together\n` +
        `• Real-world example: Just like building blocks, each piece fits together\n\n` +
        `**Why it matters:** Understanding ${topic} helps you see the bigger picture and solve related problems more easily.`,
    },
    intermediate: {
      default: `## ${topic} — Intermediate Explanation\n\n` +
        `${topic} is a concept that operates on several interconnected principles:\n\n` +
        `### Core Mechanism\n` +
        `At its heart, ${topic} works by processing information through defined stages. Each stage transforms the input in a specific way.\n\n` +
        `### Key Components\n` +
        `1. **Foundation Layer** — The base principles that ${topic} relies on\n` +
        `2. **Processing Layer** — Where the main transformation happens\n` +
        `3. **Output Layer** — The results and applications\n\n` +
        `### Practical Application\n` +
        `In practice, ${topic} is used to solve problems like optimization, pattern recognition, and structured analysis.\n\n` +
        `### Common Misconceptions\n` +
        `- It's NOT just memorization — it requires understanding\n` +
        `- It builds upon prerequisite knowledge\n` +
        `- Mastery comes through practice and application`,
    },
    advanced: {
      default: `## ${topic} — Advanced Deep Dive\n\n` +
        `### Theoretical Foundation\n` +
        `${topic} emerges from the intersection of multiple disciplines. Its formal definition involves rigorous mathematical and logical frameworks.\n\n` +
        `### Formal Definition\n` +
        `Let *S* be the system under study. ${topic} can be formally described as a mapping *f: X → Y* where the transformation preserves certain invariant properties.\n\n` +
        `### Advanced Properties\n` +
        `1. **Composability** — Complex instances can be decomposed into simpler sub-problems\n` +
        `2. **Scalability** — The approach generalizes across different scales\n` +
        `3. **Optimality** — Under certain constraints, provably optimal solutions exist\n\n` +
        `### Research Frontiers\n` +
        `Current research in ${topic} focuses on:\n` +
        `- Extending theoretical bounds\n` +
        `- Novel applications in emerging fields\n` +
        `- Computational efficiency improvements\n\n` +
        `### Critical Analysis\n` +
        `While powerful, ${topic} has known limitations including edge cases and computational complexity constraints that active research aims to address.`,
    }
  };

  return {
    topic,
    level,
    explanation: (explanations[level] || explanations.simple).default,
    relatedTopics: generateRelatedTopics(topic),
    estimatedReadTime: level === 'simple' ? '2 min' : level === 'intermediate' ? '5 min' : '10 min'
  };
}

function generateRelatedTopics(topic) {
  const related = [
    `Advanced ${topic}`,
    `${topic} in Practice`,
    `History of ${topic}`,
    `${topic} vs Alternatives`,
    `Applications of ${topic}`
  ];
  return related.slice(0, 3);
}

function generateSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const wordCount = text.split(/\s+/).length;

  let bulletPoints = [];
  if (sentences.length > 0) {
    const step = Math.max(1, Math.floor(sentences.length / 5));
    for (let i = 0; i < sentences.length && bulletPoints.length < 5; i += step) {
      bulletPoints.push(sentences[i].trim());
    }
  }

  if (bulletPoints.length === 0) {
    bulletPoints = [
      "The text discusses key concepts and their relationships",
      "Main ideas are presented with supporting evidence",
      "Practical applications are highlighted",
      "Important terminology is defined and explained"
    ];
  }

  return {
    summary: bulletPoints.map(bp => `• ${bp}`).join('\n'),
    keyTerms: extractKeyTerms(text),
    originalWordCount: wordCount,
    summaryWordCount: bulletPoints.join(' ').split(/\s+/).length,
    compressionRatio: Math.round((1 - bulletPoints.join(' ').split(/\s+/).length / Math.max(wordCount, 1)) * 100) + '%'
  };
}

function extractKeyTerms(text) {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'this', 'that', 'these', 'those', 'it', 'its']);
  const freq = {};
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '');
    if (clean.length > 3 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}

function generateQuiz(topic, count = 5) {
  const quizTemplates = [
    {
      question: `What is the primary purpose of ${topic}?`,
      options: [
        `To provide a structured approach to understanding complex systems`,
        `To replace all existing methodologies`,
        `To simplify unrelated concepts`,
        `To eliminate the need for further study`
      ],
      correct: 0,
      explanation: `${topic} primarily aims to provide structured understanding of complex systems through organized principles.`
    },
    {
      question: `Which of the following best describes a key characteristic of ${topic}?`,
      options: [
        `It only works in theoretical scenarios`,
        `It builds upon foundational principles and scales to complex applications`,
        `It requires no prerequisite knowledge`,
        `It cannot be applied practically`
      ],
      correct: 1,
      explanation: `A key characteristic is that it builds on foundations and scales — this is what makes ${topic} powerful and versatile.`
    },
    {
      question: `What is a common misconception about ${topic}?`,
      options: [
        `It requires deep understanding`,
        `It has practical applications`,
        `It can be mastered through memorization alone`,
        `It connects to other disciplines`
      ],
      correct: 2,
      explanation: `Many students think ${topic} can be memorized, but true mastery requires understanding and application.`
    },
    {
      question: `In what context is ${topic} most commonly applied?`,
      options: [
        `Only in academic research`,
        `In problem-solving and analytical thinking across multiple domains`,
        `Exclusively in laboratory settings`,
        `Only in standardized testing`
      ],
      correct: 1,
      explanation: `${topic} finds its most common application in problem-solving across various domains.`
    },
    {
      question: `What prerequisite knowledge is most helpful for understanding ${topic}?`,
      options: [
        `No prerequisites are needed`,
        `Only advanced mathematics`,
        `Basic foundational concepts in the related field`,
        `Expert-level domain knowledge`
      ],
      correct: 2,
      explanation: `Having basic foundational concepts helps build a strong understanding of ${topic}.`
    },
    {
      question: `How does ${topic} relate to real-world problem solving?`,
      options: [
        `It has no real-world applications`,
        `It provides frameworks that can be adapted to solve practical problems`,
        `It only applies to textbook problems`,
        `It makes problems more complicated`
      ],
      correct: 1,
      explanation: `${topic} provides adaptable frameworks for solving real-world problems effectively.`
    },
    {
      question: `What is the best approach to studying ${topic}?`,
      options: [
        `Read once and move on`,
        `Memorize all formulas without understanding`,
        `Practice with examples and understand underlying principles`,
        `Skip the basics and jump to advanced topics`
      ],
      correct: 2,
      explanation: `The most effective approach combines practice with understanding of underlying principles.`
    }
  ];

  const selected = quizTemplates.slice(0, Math.min(count, quizTemplates.length));
  return {
    topic,
    questions: selected,
    totalQuestions: selected.length,
    estimatedTime: `${selected.length * 2} minutes`
  };
}

function generateFlashcards(topic, count = 6) {
  const templates = [
    { front: `Define ${topic}`, back: `${topic} is a systematic approach to understanding and applying core principles within its domain. It involves structured analysis and practical application of theoretical concepts.` },
    { front: `What are the 3 key components of ${topic}?`, back: `1. **Foundation** — Core principles and definitions\n2. **Methodology** — Approaches and techniques\n3. **Application** — Real-world use cases and practice` },
    { front: `Why is ${topic} important?`, back: `${topic} is important because it:\n• Builds critical thinking skills\n• Provides structured problem-solving frameworks\n• Connects theory to practice\n• Enables deeper understanding of related concepts` },
    { front: `Common mistake when studying ${topic}?`, back: `The most common mistake is **rote memorization** without understanding.\n\nInstead, focus on:\n• Understanding the 'why' behind concepts\n• Practicing with varied examples\n• Making connections to prior knowledge` },
    { front: `How to apply ${topic} in practice?`, back: `Step-by-step application:\n1. Identify the problem context\n2. Map relevant principles from ${topic}\n3. Design a solution using appropriate methods\n4. Test and validate your approach\n5. Iterate and refine` },
    { front: `${topic}: Key formula/principle`, back: `The fundamental principle states that complex problems in ${topic} can be decomposed into simpler sub-problems.\n\n**Remember:** Start simple, build complexity gradually, and always verify your understanding.` },
    { front: `What connects ${topic} to other subjects?`, back: `${topic} shares connections with:\n• **Logic** — Structured reasoning\n• **Mathematics** — Quantitative analysis\n• **Science** — Empirical validation\n• **Communication** — Clear expression of ideas` },
    { front: `Quick review: ${topic} essentials`, back: `✅ Understand core definitions\n✅ Know the key principles\n✅ Practice with examples\n✅ Connect to real-world scenarios\n✅ Review and self-test regularly` },
  ];

  const selected = templates.slice(0, Math.min(count, templates.length));
  return {
    topic,
    cards: selected.map((card, i) => ({ id: i + 1, ...card, mastered: false })),
    totalCards: selected.length
  };
}

function generateChatReply(message, history = []) {
  const msg = message.toLowerCase();
  let reply = '';

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    reply = "Hello! 👋 I'm your AI Study Buddy. I can help you with:\n\n" +
      "📖 **Explaining topics** — Ask me to explain anything!\n" +
      "📝 **Summarizing notes** — Paste your notes and I'll condense them\n" +
      "❓ **Generating quizzes** — Test your knowledge\n" +
      "🃏 **Creating flashcards** — For quick review\n\n" +
      "What would you like to study today?";
  } else if (msg.includes('explain') || msg.includes('what is') || msg.includes('what are') || msg.includes('define')) {
    const topic = message.replace(/explain|what is|what are|define|please|can you|tell me about/gi, '').trim() || 'this concept';
    reply = `Great question! Let me explain **${topic}**:\n\n` +
      `**${topic}** is a concept that involves understanding and applying specific principles. ` +
      `Think of it as building blocks — each piece connects to form a complete picture.\n\n` +
      `**Key takeaways:**\n` +
      `1. It starts with fundamental principles\n` +
      `2. Each concept builds on the previous one\n` +
      `3. Practice and application solidify understanding\n\n` +
      `Would you like me to go deeper, create a quiz, or make flashcards on this topic? 🎓`;
  } else if (msg.includes('quiz') || msg.includes('test')) {
    reply = "I'd love to help you test your knowledge! 🎯\n\n" +
      "To generate a quiz, head over to the **Quiz Generator** tab and enter your topic.\n\n" +
      "Or tell me the subject and I can give you a quick question right here!\n\n" +
      "What topic would you like to be quizzed on?";
  } else if (msg.includes('flashcard')) {
    reply = "Flashcards are a great study tool! 🃏\n\n" +
      "Check out the **Flashcards** tab to generate a full set.\n\n" +
      "Or tell me a topic and I'll give you a quick one:\n\n" +
      "**Front:** What's on your mind?\n**Back:** The answer you're looking for! 😄\n\n" +
      "What topic should the flashcards cover?";
  } else if (msg.includes('summarize') || msg.includes('summary')) {
    reply = "I can help summarize your notes! 📝\n\n" +
      "Head to the **Summarizer** tab and paste your text, or share it here in chat.\n\n" +
      "I'll extract the key points and give you a concise summary with important terms highlighted.";
  } else if (msg.includes('help') || msg.includes('how')) {
    reply = "Here's how I can help you study more effectively:\n\n" +
      "🔹 **Type a question** — I'll answer it conversationally\n" +
      "🔹 **Use the tabs above** — For specialized tools:\n" +
      "   • 💡 Explainer — Deep topic explanations\n" +
      "   • 📝 Summarizer — Condense long notes\n" +
      "   • ❓ Quiz — Test your knowledge\n" +
      "   • 🃏 Flashcards — Quick review cards\n\n" +
      "🔹 **Study tips:**\n" +
      "   • Break study sessions into 25-min blocks (Pomodoro)\n" +
      "   • Test yourself regularly with quizzes\n" +
      "   • Use flashcards for spaced repetition\n\n" +
      "What would you like to work on?";
  } else if (msg.includes('thank')) {
    reply = "You're welcome! 😊 Happy studying! Remember:\n\n" +
      "💪 Consistency beats intensity\n" +
      "🧠 Understanding beats memorization\n" +
      "📚 Practice makes permanent\n\n" +
      "I'm here whenever you need help!";
  } else {
    reply = `That's an interesting question about "${message}"!\n\n` +
      `Here's what I can tell you:\n\n` +
      `This topic involves understanding core principles and their applications. ` +
      `The key is to break it down into smaller, manageable concepts.\n\n` +
      `**My suggestions:**\n` +
      `1. Start with the basics — make sure fundamentals are solid\n` +
      `2. Look for patterns and connections\n` +
      `3. Practice with real examples\n` +
      `4. Test yourself regularly\n\n` +
      `Want me to create a quiz or flashcards on this topic? Or would you like a more detailed explanation? 🎓`;
  }

  return {
    reply,
    timestamp: new Date().toISOString(),
    suggestions: [
      "Explain this in simpler terms",
      "Create a quiz on this topic",
      "Generate flashcards",
      "Give me study tips"
    ]
  };
}

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🎓 AI Study Buddy is running!`);
  console.log(`  ➜ Local: http://localhost:${PORT}\n`);
});
