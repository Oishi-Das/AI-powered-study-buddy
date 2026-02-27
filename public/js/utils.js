/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Utility Functions
   ═══════════════════════════════════════════════════════════════════ */

const Utils = {
  // Simple Markdown → HTML converter
  markdownToHtml(md) {
    if (!md) return '';
    let html = md
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold & Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/^[•\-] (.+)$/gm, '<li>$1</li>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap loose <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>(\s*<br>)?)+/g, (match) => {
      return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
    });

    return '<p>' + html + '</p>';
  },

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Format time
  formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  // Generate unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Confetti effect
  spawnConfetti(count = 30) {
    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e', '#74b9ff', '#ff6b6b'];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 50 + 50 + 'vh';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDuration = (0.5 + Math.random()) + 's';
      particle.style.animationDelay = Math.random() * 0.3 + 's';
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 2000);
    }
  },

  // Typing animation for text
  async typeText(element, text, speed = 20) {
    const html = this.markdownToHtml(text);
    element.innerHTML = '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const fullText = temp.textContent;

    let i = 0;
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (i < fullText.length) {
          i += 3; // Speed up by 3 chars at a time
          element.innerHTML = html;
          resolve();
          clearInterval(interval);
        }
      }, speed);

      // Just set full content after a brief delay for effect
      setTimeout(() => {
        clearInterval(interval);
        element.innerHTML = html;
        resolve();
      }, Math.min(text.length * 2, 800));
    });
  },

  // Debounce function
  debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Local storage helpers
  storage: {
    get(key, defaultVal = null) {
      try {
        const val = localStorage.getItem('studybuddy_' + key);
        return val ? JSON.parse(val) : defaultVal;
      } catch {
        return defaultVal;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem('studybuddy_' + key, JSON.stringify(val));
      } catch { /* ignore */ }
    }
  }
};
