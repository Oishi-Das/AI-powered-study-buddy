/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Main App Controller
   ═══════════════════════════════════════════════════════════════════ */

const App = {
  currentTab: 'chat',
  streak: 0,

  init() {
    // Initialize all modules
    Chat.init();
    Explainer.init();
    Summarizer.init();
    Quiz.init();
    Flashcards.init();

    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Load saved data
    this.loadState();

    // Loading screen
    this.handleLoading();
  },

  handleLoading() {
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
      }, 500);
    }, 2200);
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
  },

  toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);

    const icon = document.querySelector('#theme-toggle i');
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    Utils.storage.set('theme', next);
    Utils.showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
  },

  incrementStreak() {
    this.streak++;
    document.getElementById('streak-count').textContent = this.streak;
    Utils.storage.set('streak', this.streak);

    // Milestone celebrations
    if (this.streak === 5) {
      Utils.showToast('🔥 5 actions! You\'re on fire!', 'success');
    } else if (this.streak === 10) {
      Utils.showToast('🎯 10 actions! Keep going!', 'success');
      Utils.spawnConfetti(20);
    } else if (this.streak % 25 === 0) {
      Utils.showToast(`🏆 ${this.streak} actions! Incredible streak!`, 'success');
      Utils.spawnConfetti(40);
    }
  },

  loadState() {
    // Theme
    const savedTheme = Utils.storage.get('theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('#theme-toggle i');
    icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    // Streak
    this.streak = Utils.storage.get('streak', 0);
    document.getElementById('streak-count').textContent = this.streak;
  }
};

// ── Boot ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
