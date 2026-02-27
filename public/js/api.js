/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — API Client
   ═══════════════════════════════════════════════════════════════════ */

const API = {
  async post(endpoint, data) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      Utils.showToast('Something went wrong. Please try again.', 'error');
      throw error;
    }
  },

  explain(topic, level) {
    return this.post('/api/explain', { topic, level });
  },

  summarize(text) {
    return this.post('/api/summarize', { text });
  },

  quiz(topic, count) {
    return this.post('/api/quiz', { topic, count });
  },

  flashcards(topic, count) {
    return this.post('/api/flashcards', { topic, count });
  },

  chat(message, history) {
    return this.post('/api/chat', { message, history });
  }
};
