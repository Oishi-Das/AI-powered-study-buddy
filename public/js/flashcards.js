/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Flashcards Module
   ═══════════════════════════════════════════════════════════════════ */

const Flashcards = {
  cards: [],
  currentIndex: 0,
  cardCount: 6,
  isFlipped: false,

  init() {
    // Count selector
    document.querySelectorAll('#tab-flashcards .count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tab-flashcards .count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.cardCount = parseInt(btn.dataset.count);
      });
    });

    // Generate button
    document.getElementById('flashcard-btn').addEventListener('click', () => this.generate());

    // Enter on input
    document.getElementById('flashcard-topic').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.generate();
    });

    // Flip card
    document.getElementById('flashcard').addEventListener('click', () => this.flip());

    // Navigation
    document.getElementById('fc-prev').addEventListener('click', () => this.prev());
    document.getElementById('fc-next').addEventListener('click', () => this.next());

    // Action buttons
    document.getElementById('fc-hard').addEventListener('click', () => this.markCard('review'));
    document.getElementById('fc-good').addEventListener('click', () => this.markCard('good'));
    document.getElementById('fc-easy').addEventListener('click', () => this.markCard('mastered'));

    // Back button
    document.getElementById('fc-back-btn').addEventListener('click', () => this.backToSetup());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('tab-flashcards').classList.contains('active')) return;
      if (document.getElementById('flashcard-area').classList.contains('hidden')) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          this.flip();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case '1':
          this.markCard('review');
          break;
        case '2':
          this.markCard('good');
          break;
        case '3':
          this.markCard('mastered');
          break;
      }
    });
  },

  async generate() {
    const topic = document.getElementById('flashcard-topic').value.trim();
    if (!topic) {
      Utils.showToast('Please enter a topic for flashcards', 'error');
      return;
    }

    const btn = document.getElementById('flashcard-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div> <span>Creating cards...</span>';
    btn.disabled = true;

    try {
      const data = await API.flashcards(topic, this.cardCount);
      this.cards = data.cards.map(card => ({ ...card, status: 'unseen' }));
      this.currentIndex = 0;
      this.isFlipped = false;

      // Switch views
      document.getElementById('flashcard-setup').classList.add('hidden');
      document.getElementById('flashcard-area').classList.remove('hidden');

      this.renderCard();
      this.renderProgress();

      Utils.showToast(`${data.totalCards} flashcards created!`, 'success');
    } catch (error) {
      Utils.showToast('Failed to generate flashcards', 'error');
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  },

  renderCard() {
    const card = this.cards[this.currentIndex];
    const flashcardEl = document.getElementById('flashcard');

    // Remove flip
    flashcardEl.classList.remove('flipped');
    this.isFlipped = false;

    // Set content
    document.getElementById('fc-front').textContent = card.front;
    document.getElementById('fc-back').innerHTML = Utils.markdownToHtml(card.back);

    // Update counter
    document.getElementById('fc-counter').textContent = `${this.currentIndex + 1} / ${this.cards.length}`;

    // Update progress dots
    this.renderProgress();
  },

  renderProgress() {
    const progressEl = document.getElementById('fc-progress');
    progressEl.innerHTML = this.cards.map((card, i) => {
      let cls = 'fc-dot';
      if (i === this.currentIndex) cls += ' current';
      if (card.status === 'mastered') cls += ' mastered';
      else if (card.status === 'review') cls += ' review';
      return `<div class="${cls}"></div>`;
    }).join('');
  },

  flip() {
    const flashcardEl = document.getElementById('flashcard');
    flashcardEl.classList.toggle('flipped');
    this.isFlipped = !this.isFlipped;
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCard();
    }
  },

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.renderCard();
    }
  },

  markCard(status) {
    this.cards[this.currentIndex].status = status;
    this.renderProgress();

    const messages = {
      review: 'Marked for review 📝',
      good: 'Nice! Keep it up 👍',
      mastered: 'Mastered! ⭐'
    };
    Utils.showToast(messages[status], status === 'review' ? 'info' : 'success');

    // Auto-advance
    if (this.currentIndex < this.cards.length - 1) {
      setTimeout(() => {
        this.currentIndex++;
        this.renderCard();
      }, 400);
    } else {
      // All cards reviewed
      const mastered = this.cards.filter(c => c.status === 'mastered').length;
      const review = this.cards.filter(c => c.status === 'review').length;

      if (mastered === this.cards.length) {
        Utils.spawnConfetti(30);
        Utils.showToast('🎉 All cards mastered! Amazing!', 'success');
      } else if (review > 0) {
        Utils.showToast(`${review} card(s) need review. Keep studying!`, 'info');
      }

      App.incrementStreak();
    }
  },

  backToSetup() {
    document.getElementById('flashcard-setup').classList.remove('hidden');
    document.getElementById('flashcard-area').classList.add('hidden');
  }
};
