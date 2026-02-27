/* ═══════════════════════════════════════════════════════════════════
   AI Study Buddy — Quiz Module
   ═══════════════════════════════════════════════════════════════════ */

const Quiz = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  questionCount: 5,

  init() {
    // Count selector
    document.querySelectorAll('#tab-quiz .count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tab-quiz .count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.questionCount = parseInt(btn.dataset.count);
      });
    });

    // Start quiz
    document.getElementById('quiz-btn').addEventListener('click', () => this.start());

    // Next question
    document.getElementById('quiz-next').addEventListener('click', () => this.next());

    // Retry
    document.getElementById('quiz-retry').addEventListener('click', () => this.reset());

    // Enter on topic input
    document.getElementById('quiz-topic').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.start();
    });
  },

  async start() {
    const topic = document.getElementById('quiz-topic').value.trim();
    if (!topic) {
      Utils.showToast('Please enter a quiz topic', 'error');
      return;
    }

    const btn = document.getElementById('quiz-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner"></div> <span>Generating...</span>';
    btn.disabled = true;

    try {
      const data = await API.quiz(topic, this.questionCount);
      this.questions = data.questions;
      this.currentIndex = 0;
      this.score = 0;
      this.answered = false;

      // Switch views
      document.getElementById('quiz-setup').classList.add('hidden');
      document.getElementById('quiz-area').classList.remove('hidden');
      document.getElementById('quiz-results').classList.add('hidden');

      this.renderQuestion();
      Utils.showToast(`Quiz started! ${data.totalQuestions} questions`, 'success');
    } catch (error) {
      Utils.showToast('Failed to generate quiz', 'error');
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  },

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    this.answered = false;

    // Progress
    const progress = ((this.currentIndex) / total) * 100;
    document.getElementById('quiz-progress-fill').style.width = progress + '%';
    document.getElementById('quiz-progress-text').textContent = `Question ${this.currentIndex + 1} of ${total}`;

    // Question
    document.getElementById('quiz-question').textContent = q.question;

    // Options
    const letters = ['A', 'B', 'C', 'D'];
    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <div class="quiz-option" data-index="${i}" style="animation-delay: ${i * 0.08}s">
        <span class="option-letter">${letters[i]}</span>
        <span>${opt}</span>
      </div>
    `).join('');

    // Add click handlers
    optionsEl.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => this.answer(parseInt(opt.dataset.index)));
    });

    // Hide explanation & next button
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-next').classList.add('hidden');
  },

  answer(index) {
    if (this.answered) return;
    this.answered = true;

    const q = this.questions[this.currentIndex];
    const options = document.querySelectorAll('.quiz-option');

    // Mark all as disabled
    options.forEach(opt => opt.classList.add('disabled'));

    // Mark correct
    options[q.correct].classList.add('correct');

    // Mark selected if wrong
    if (index !== q.correct) {
      options[index].classList.add('incorrect');
    } else {
      this.score++;
    }

    // Show explanation
    const explEl = document.getElementById('quiz-explanation');
    explEl.innerHTML = `<i class="fas fa-lightbulb"></i> ${q.explanation}`;
    explEl.classList.remove('hidden');

    // Show next button
    const nextBtn = document.getElementById('quiz-next');
    nextBtn.classList.remove('hidden');

    if (this.currentIndex === this.questions.length - 1) {
      nextBtn.innerHTML = 'See Results <i class="fas fa-trophy"></i>';
    }
  },

  next() {
    this.currentIndex++;

    if (this.currentIndex >= this.questions.length) {
      this.showResults();
    } else {
      this.renderQuestion();
    }
  },

  showResults() {
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');

    const total = this.questions.length;
    const percentage = Math.round((this.score / total) * 100);

    // Icon and title based on score
    let icon, title;
    if (percentage >= 80) {
      icon = '🏆';
      title = 'Excellent Work!';
      Utils.spawnConfetti(40);
    } else if (percentage >= 60) {
      icon = '👏';
      title = 'Good Job!';
    } else if (percentage >= 40) {
      icon = '💪';
      title = 'Keep Practicing!';
    } else {
      icon = '📚';
      title = 'Time to Review!';
    }

    document.getElementById('results-icon').textContent = icon;
    document.getElementById('results-title').textContent = title;
    document.getElementById('results-score').textContent = `${percentage}%`;
    document.getElementById('results-breakdown').innerHTML = `
      <span><span class="correct-count">✓ ${this.score} correct</span></span>
      <span><span class="incorrect-count">✗ ${total - this.score} incorrect</span></span>
      <span>${total} total</span>
    `;

    // Update progress bar to full
    document.getElementById('quiz-progress-fill').style.width = '100%';

    App.incrementStreak();
  },

  reset() {
    document.getElementById('quiz-setup').classList.remove('hidden');
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-progress-fill').style.width = '0%';
  }
};
