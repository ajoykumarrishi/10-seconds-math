let correctAnswer;
let score = 0;
let timeRemaining = 10;
let timerInterval;

// Generate random number between start and end (inclusive)
const generateRandomNumber = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;

// Generate random pair of numbers for the specified game mode and return the pair along with the correct answer
const generateRandomPair = (gameMode) => {
    let numOne, numTwo;
    switch (gameMode) {
        case 'addition':
            numOne = generateRandomNumber(1, 20);
            numTwo = generateRandomNumber(1, 20);
            correctAnswer = numOne + numTwo;
            break;
        case 'subtraction':
            numOne = generateRandomNumber(10, 30);
            numTwo = generateRandomNumber(1, 10);
            correctAnswer = numOne - numTwo;
            break;
        case 'multiplication':
            numOne = generateRandomNumber(1, 10);
            numTwo = generateRandomNumber(1, 10);
            correctAnswer = numOne * numTwo;
            break;
        case 'division':
            numOne = generateRandomNumber(1, 10) * generateRandomNumber(1, 10);
            numTwo = generateRandomNumber(1, 10);
            correctAnswer = numOne / numTwo;
            break;
        case 'mixed':
            const modes = ['addition', 'subtraction', 'multiplication', 'division'];
            return generateRandomPair(modes[generateRandomNumber(0, 3)]);
    }
    return { numOne, numTwo };
};

// Update the timer display
const updateTimerDisplay = () => {
    timer.text(`${timeRemaining}s`);
}

// Start the game timer
const startTimer = () => {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            userGuess.prop('disabled', true);
            startButton.prop('disabled', true);
        }
    }, 1000);
};

// Update the timer and score if the answer is correct
const updateGameStatus = (isCorrect) => {
    if (isCorrect) {
        score++;
        timeRemaining += 1;
        scoreBoard.text(`Score: ${score}`);
    }
    updateTimerDisplay();
}

// Start a new round
const nextRound = (gameMode) => {
    const { numOne, numTwo } = generateRandomPair(gameMode);
    question.text(`${numOne} + ${numTwo}`);
};

// Initialize the game
const initializeGame = () => {
    score = 0;
    timeRemaining = 10;
    scoreBoard.text(`Score: ${score}`);
    userGuess.val('');
    userGuess.prop('disabled', false);
    startButton.prop('disabled', true);
    startTimer();
    nextRound(gameModeSelect.val());
};

// Reset the game
const resetGame = () => {
    clearInterval(timerInterval);
    userGuess.prop('disabled', true);
    startButton.prop('disabled', false);
    timer.text(`10s`);
    scoreBoard.text(`Score: 0`);
    question.text('');
    userGuess.val('');
    userGuess.prop('placeholder', 'Enter your answer');
}

// Selectors
const startButton = $('.start-btn');
const userGuess = $('.user-guess');
const question = $('.question');
const scoreBoard = $('.score');
const timer = $('.timer');
const resetButton = $('.reset-btn');
const gameModeSelect = $('.game-mode');

// Event listeners
userGuess.on('keydown', (e) => {
    if (e.key === 'Enter') {
        const userGuessValue = parseInt(userGuess.val(), 10);
        if (userGuessValue === correctAnswer) {
            updateGameStatus(true);
            userGuess.val('');
            userGuess.prop('placeholder', 'Enter your answer');
            nextRound(gameModeSelect.val());
        } else {
            userGuess.val('');
            userGuess.prop('placeholder', 'Try again');
        }
    }
});

$(document).ready(() => {
    startButton.click(initializeGame);
    resetButton.click(resetGame);
});