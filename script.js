class NumberGuessingGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.maxAttempts = 4;
        this.gameWon = false;
        this.gameOver = false;
        this.guessHistory = [];
        
        // Load stats from memory
        this.stats = {
            bestScore: null,
            gamesWon: 0
        };
        
        this.initializeElements();
        this.startNewGame();
        this.bindEvents();
    }
    
    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.submitBtn = document.getElementById('submitGuess');
        this.feedbackEl = document.getElementById('feedback');
        this.attemptsEl = document.getElementById('attempts');
        this.bestScoreEl = document.getElementById('bestScore');
        this.gamesWonEl = document.getElementById('gamesWon');
        this.newGameBtn = document.getElementById('newGame');
        this.giveUpBtn = document.getElementById('giveUp');
        this.guessListEl = document.getElementById('guessList');
    }
    
    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.giveUpBtn.addEventListener('click', () => this.giveUp());
        
        // Auto-focus input
        this.guessInput.focus();
    }
    
    startNewGame() {
        this.targetNumber = Math.floor(Math.random() * 10) + 1;
        this.attempts = 0;
        this.gameWon = false;
        this.gameOver = false;
        this.guessHistory = [];
        
        // Reset UI
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.submitBtn.disabled = false;
        this.feedbackEl.textContent = 'Make your first guess!';
        this.feedbackEl.className = 'feedback';
        this.updateAttempts();
        this.updateGuessHistory();
        this.guessInput.focus();
        
        console.log(`New game started. Target number: ${this.targetNumber}`); // For debugging
    }
    
    makeGuess() {
        if (this.gameOver) return;
        
        const guess = parseInt(this.guessInput.value);
        
        // Validate input
        if (isNaN(guess) || guess < 1 || guess > 10) {
            this.showFeedback('Please enter a number between 1 and 10!', 'error');
            return;
        }
        
        // Check if already guessed
        if (this.guessHistory.some(g => g.value === guess)) {
            this.showFeedback('You already guessed that number!', 'error');
            return;
        }
        
        this.attempts++;
        let feedback = '';
        let feedbackClass = '';
        
        if (guess === this.targetNumber) {
            feedback = `🎉 Congratulations! You guessed it in ${this.attempts} attempts!`;
            feedbackClass = 'correct';
            this.gameWon = true;
            this.gameOver = true;
            this.updateStats();
            this.guessHistory.push({ value: guess, result: 'correct' });
        } else if (guess < this.targetNumber) {
            feedback = '📈 Too low! Try a higher number.';
            feedbackClass = 'too-low';
            this.guessHistory.push({ value: guess, result: 'too-low' });
        } else {
            feedback = '📉 Too high! Try a lower number.';
            feedbackClass = 'too-high';
            this.guessHistory.push({ value: guess, result: 'too-high' });
        }
        
        // Check if max attempts reached
        if (this.attempts >= this.maxAttempts && !this.gameWon) {
            feedback += ` Game Over! The number was ${this.targetNumber}.`;
            this.gameOver = true;
        }
        
        this.showFeedback(feedback, feedbackClass);
        this.updateAttempts();
        this.updateGuessHistory();
        
        if (this.gameOver) {
            this.guessInput.disabled = true;
            this.submitBtn.disabled = true;
        } else {
            this.guessInput.value = '';
            this.guessInput.focus();
        }
    }
    
    showFeedback(message, className) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `feedback ${className}`;
    }
    
    updateAttempts() {
        this.attemptsEl.textContent = `Attempts: ${this.attempts}/${this.maxAttempts}`;
    }
    
    updateGuessHistory() {
        this.guessListEl.innerHTML = '';
        this.guessHistory.forEach(guess => {
            const guessEl = document.createElement('span');
            guessEl.className = `guess-item ${guess.result}`;
            guessEl.textContent = guess.value;
            this.guessListEl.appendChild(guessEl);
        });
    }
    
    updateStats() {
        if (this.gameWon) {
            this.stats.gamesWon++;
            
            if (this.stats.bestScore === null || this.attempts < this.stats.bestScore) {
                this.stats.bestScore = this.attempts;
            }
        }
        
        this.bestScoreEl.textContent = this.stats.bestScore || '-';
        this.gamesWonEl.textContent = this.stats.gamesWon;
    }
    
    giveUp() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.guessInput.disabled = true;
        this.submitBtn.disabled = true;
        this.showFeedback(`Game Over! The number was ${this.targetNumber}. Better luck next time!`, 'error');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});