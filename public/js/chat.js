/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Chat Module
   ═══════════════════════════════════════════════════════════════════ */

const Chat = {
  history: [],
  messagesEl: null,
  inputEl: null,

  init() {
    this.messagesEl = document.getElementById('chat-messages');
    this.inputEl = document.getElementById('chat-input');

    // Send button
    document.getElementById('chat-send').addEventListener('click', () => this.send());

    // Enter to send (Shift+Enter for newline)
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    // Auto-resize textarea
    this.inputEl.addEventListener('input', () => {
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 120) + 'px';
    });

    // Suggestion pills
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.inputEl.value = pill.textContent;
        this.send();
      });
    });

    // Feature chips in welcome message
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const action = chip.dataset.action;
        // Switch to the appropriate tab
        document.querySelector(`[data-tab="${action}"]`).click();
      });
    });

    // Clear chat
    document.getElementById('clear-chat').addEventListener('click', () => {
      this.clearChat();
    });
  },

  async send() {
    const message = this.inputEl.value.trim();
    if (!message) return;

    // Clear input
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';

    // Hide suggestion pills after first message
    document.getElementById('suggestion-pills').style.display = 'none';

    // Add user message
    this.addMessage(message, 'user');
    this.history.push({ role: 'user', content: message });

    // Show typing indicator
    const typingEl = this.showTyping();

    try {
      const data = await API.chat(message, this.history);

      // Remove typing indicator
      typingEl.remove();

      // Add bot response
      this.addMessage(data.reply, 'bot', true);
      this.history.push({ role: 'bot', content: data.reply });

      // Update streak
      App.incrementStreak();
    } catch (error) {
      typingEl.remove();
      this.addMessage("Sorry, I couldn't process that. Please try again!", 'bot');
    }
  },

  addMessage(text, sender, animate = false) {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;

    const avatar = sender === 'bot'
      ? '<i class="fas fa-robot"></i>'
      : '<i class="fas fa-user"></i>';

    const htmlContent = Utils.markdownToHtml(text);

    msgEl.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <div class="message-bubble glass-subtle">${htmlContent}</div>
        <span class="message-time">${Utils.formatTime()}</span>
      </div>
    `;

    this.messagesEl.appendChild(msgEl);
    this.scrollToBottom();
  },

  showTyping() {
    const typingEl = document.createElement('div');
    typingEl.className = 'message bot fade-in';
    typingEl.innerHTML = `
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-content">
        <div class="message-bubble glass-subtle">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
    this.messagesEl.appendChild(typingEl);
    this.scrollToBottom();
    return typingEl;
  },

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }, 50);
  },

  clearChat() {
    this.history = [];
    this.messagesEl.innerHTML = '';
    document.getElementById('suggestion-pills').style.display = 'flex';

    // Re-add welcome message
    const welcome = document.createElement('div');
    welcome.className = 'message bot fade-in';
    welcome.innerHTML = `
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-content">
        <div class="message-bubble glass-subtle">
          <p>Chat cleared! 🧹 I'm ready to help you study. What would you like to learn about?</p>
        </div>
        <span class="message-time">${Utils.formatTime()}</span>
      </div>
    `;
    this.messagesEl.appendChild(welcome);

    Utils.showToast('Chat cleared', 'info');
  }
};
