/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Explainer Module
   ═══════════════════════════════════════════════════════════════════ */

const Explainer = {
  currentLevel: 'simple',

  init() {
    // Level selector
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLevel = btn.dataset.level;
      });
    });

    // Explain button
    document.getElementById('explain-btn').addEventListener('click', () => this.explain());

    // Enter key on input
    document.getElementById('explain-topic').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.explain();
    });
  },

  async explain() {
    const topic = document.getElementById('explain-topic').value.trim();
    if (!topic) {
      Utils.showToast('Please enter a topic to explain', 'error');
      return;
    }

    const btn = document.getElementById('explain-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div> <span>Thinking...</span>';
    btn.disabled = true;

    try {
      const data = await API.explain(topic, this.currentLevel);

      // Show result area
      const resultEl = document.getElementById('explain-result');
      resultEl.classList.remove('hidden');

      // Set read time
      document.getElementById('explain-read-time').textContent = `⏱ ${data.estimatedReadTime} read`;

      // Render explanation with typing effect
      const contentEl = document.getElementById('explain-content');
      contentEl.innerHTML = Utils.markdownToHtml(data.explanation);

      // Related topics
      const relatedEl = document.getElementById('related-topics');
      relatedEl.innerHTML = '<span style="font-size:13px;color:var(--text-muted);margin-right:8px;">Related:</span>' +
        data.relatedTopics.map(t =>
          `<span class="related-topic-chip" onclick="document.getElementById('explain-topic').value='${t}';Explainer.explain();">${t}</span>`
        ).join('');

      // Smooth scroll to result
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      App.incrementStreak();
      Utils.showToast('Explanation generated!', 'success');
    } catch (error) {
      Utils.showToast('Failed to generate explanation', 'error');
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  }
};
