/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Summarizer Module
   ═══════════════════════════════════════════════════════════════════ */

const Summarizer = {
  init() {
    // Character counter
    const textarea = document.getElementById('summarize-text');
    textarea.addEventListener('input', () => {
      document.getElementById('char-count').textContent = textarea.value.length;
    });

    // Summarize button
    document.getElementById('summarize-btn').addEventListener('click', () => this.summarize());
  },

  async summarize() {
    const text = document.getElementById('summarize-text').value.trim();
    if (!text) {
      Utils.showToast('Please paste some text to summarize', 'error');
      return;
    }

    if (text.length < 50) {
      Utils.showToast('Please provide more text for a meaningful summary (at least 50 characters)', 'error');
      return;
    }

    const btn = document.getElementById('summarize-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div> <span>Summarizing...</span>';
    btn.disabled = true;

    try {
      const data = await API.summarize(text);

      // Show result
      const resultEl = document.getElementById('summarize-result');
      resultEl.classList.remove('hidden');

      // Stats
      document.getElementById('summary-stats').innerHTML = `
        <div class="stat-card pop-in stagger-1">
          <div class="stat-value">${data.originalWordCount}</div>
          <div class="stat-label">Original Words</div>
        </div>
        <div class="stat-card pop-in stagger-2">
          <div class="stat-value">${data.summaryWordCount}</div>
          <div class="stat-label">Summary Words</div>
        </div>
        <div class="stat-card pop-in stagger-3">
          <div class="stat-value">${data.compressionRatio}</div>
          <div class="stat-label">Compressed</div>
        </div>
      `;

      // Summary content
      const contentEl = document.getElementById('summarize-content');
      contentEl.innerHTML = Utils.markdownToHtml(data.summary);

      // Key terms
      const termsEl = document.getElementById('key-terms');
      termsEl.innerHTML = data.keyTerms.map(term =>
        `<span class="key-term">${term}</span>`
      ).join('');

      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      App.incrementStreak();
      Utils.showToast('Summary generated!', 'success');
    } catch (error) {
      Utils.showToast('Failed to generate summary', 'error');
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  }
};
