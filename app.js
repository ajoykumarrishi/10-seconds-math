let correctAnswer;
let score = 0;
let timeRemaining = 10;
let timerInterval;

// Generate random number between start and end (inclusive)
const generateRandomNumber = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;

// Mode specific random pair generation
const generateRandomPairAddition = (start, end) => {
    const numOne = generateRandomNumber(start, end);
    const numTwo = generateRandomNumber(start, end);
    correctAnswer = numOne + numTwo;
    return [numOne, numTwo, '+'];
}

const generateRandomPairSubtraction = (start, end) => {
    let numOne = generateRandomNumber(start, end);
    let numTwo = generateRandomNumber(start, end);
    while (numOne < numTwo) {
        numOne = generateRandomNumber(start, end);
        numTwo = generateRandomNumber(start, end);
    }
    correctAnswer = numOne - numTwo;
    return [numOne, numTwo, '-'];
}

const generateRandomPairMultiplication = (start, end) => {
    const numOne = generateRandomNumber(start, end);
    const numTwo = generateRandomNumber(start, end);
    correctAnswer = numOne * numTwo;
    return [numOne, numTwo, '*'];
}

const generateRandomPairDivision = (start, end) => {
    let numOne = generateRandomNumber(start, end);
    let numTwo = generateRandomNumber(start, end);
    while (numOne % numTwo !== 0) {
        numOne = generateRandomNumber(start, end);
        numTwo = generateRandomNumber(start, end);
    }
    correctAnswer = numOne / numTwo;
    return [numOne, numTwo, '/'];
}

// Generate random pair of numbers for the specified game mode and return the pair along with the correct answer and operand
const generateRandomPair = (start, end, mode) => {
    let numOne, numTwo, operand;
    switch (mode) {
        case 'addition':
            [numOne, numTwo, operand] = generateRandomPairAddition(start, end);
            break;
        case 'subtraction':
            [numOne, numTwo, operand] = generateRandomPairSubtraction(start, end);
            break;
        case 'multiplication':
            [numOne, numTwo, operand] = generateRandomPairMultiplication(start, end);
            break;
        case 'division':
            [numOne, numTwo, operand] = generateRandomPairDivision(start, end);
            break;
        case 'mixed':
            const modes = ['addition', 'subtraction', 'multiplication', 'division'];
            [numOne, numTwo, operand] = generateRandomPair(start, end, modes[generateRandomNumber(0, 3)]);
            break;
    }
    return [numOne, numTwo, operand];
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
            endGame();
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
const nextRound = (start, end, game) => {
    const [numOne, numTwo, operand] = generateRandomPair(start, end, game);
    question.text(`${numOne} ${operand} ${numTwo}`);
};

// Initialize the game
const initializeGame = () => {
    resetGameStatus();
    updateUIForGameStart();
    startTimer();
    nextRound(1, 20, gameModeSelect.val());
};

// Reset the game status
const resetGameStatus = () => {
    score = 0;
    timeRemaining = 10;
    correctAnswer = null;
}

// Update the UI for game start
const updateUIForGameStart = () => {
    scoreBoard.text(`Score: ${score}`);
    userGuess.val('');
    userGuess.prop('disabled', false);
    startButton.prop('disabled', true);
    gameModeSelect.prop('disabled', true);
};

// End the game and update UI
const endGame = () => {
    userGuess.prop('disabled', true);
    startButton.prop('disabled', true);
    gameModeSelect.prop('disabled', false);
};

// Reset the game
const resetGame = () => {
    clearInterval(timerInterval);
    resetGameStatus();
    updateUIForGameReset();
}

// Update the UI for game reset
const updateUIForGameReset = () => {
    userGuess.prop('disabled', true);
    startButton.prop('disabled', false);
    gameModeSelect.prop('disabled', false);
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
            nextRound(1, 20, gameModeSelect.val());
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