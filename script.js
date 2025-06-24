const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');

const gridSize = 20; // Size of each grid cell in pixels
const tileCount = 20; // Number of cells in the grid (20x20)

canvas.width = gridSize * tileCount;
canvas.height = gridSize * tileCount;

let snake = [{ x: 10, y: 10 }]; // Snake's initial position (array of segments)
let food = { x: 15, y: 15 };   // Food's initial position
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let score = 0;
let gameInterval;
let initialGameSpeed = 150; // Initial speed
let gameSpeed = initialGameSpeed; // Current game speed
let gameActive = true;
let speedIncreaseInterval = 5; // Increase speed every 5 points
let speedMultiplier = 0.9; // Game speed is multiplied by this (e.g., 10% faster)
let minGameSpeed = 50; // Fastest speed

// --- Sound Effects (Conceptual) ---
// In a real scenario, you would use Audio objects:
// const eatSound = new Audio('eat.wav');
// const gameOverSound = new Audio('gameover.wav');

function playEatSound() {
    // if (eatSound) eatSound.play();
    console.log("*nom nom* (eat sound)"); // Placeholder
}

function playGameOverSound() {
    // if (gameOverSound) gameOverSound.play();
    console.log("*womp womp* (game over sound)"); // Placeholder
}


// --- Game Board ---
function drawBoard() {
    ctx.fillStyle = '#f7f7f7'; // Light background for the board itself
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Optional: Draw grid lines
    ctx.strokeStyle = '#e0e0e0'; // Lighter grid lines
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// --- Snake ---
function drawSnake() {
    ctx.fillStyle = '#33cc33'; // Green snake
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize -1 , gridSize -1); // -1 for slight grid effect
    });
}

function moveSnake() {
    if (!gameActive) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        playEatSound(); // Play eat sound
        placeFood();

        // Increase speed
        if (score % speedIncreaseInterval === 0 && gameSpeed > minGameSpeed) {
            gameSpeed = Math.max(minGameSpeed, Math.floor(gameSpeed * speedMultiplier));
            clearInterval(gameInterval); // Clear existing interval
            gameInterval = setInterval(gameLoop, gameSpeed); // Set new interval with updated speed
            console.log("Speed increased. New interval:", gameSpeed);
        }
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

// --- Food ---
function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on the snake
    for (const segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood(); // Recursively try again
            return;
        }
    }
}

function drawFood() {
    ctx.fillStyle = '#ff3333'; // Red food
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize -1, gridSize -1); // -1 for slight grid effect
}

// --- Collision Detection ---
function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// --- Game Over ---
function gameOver() {
    gameActive = false;
    clearInterval(gameInterval);
    playGameOverSound(); // Play game over sound
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
}

// --- Restart Game ---
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = initialGameSpeed; // Reset to initial speed
    scoreDisplay.textContent = score;
    gameActive = true;
    gameOverScreen.style.display = 'none';

    // Reset gameStarted flag for the input handler
    gameStarted = false;

    // Show start screen again
    if (startScreen) {
        startScreen.style.display = 'block';
    }
    // Draw initial state, but don't start game loop until next key press
    drawBoard();
    drawFood();
    drawSnake();
    // Note: startGame() is no longer called directly here.
    // It will be called by the keydown event listener when the user presses an arrow key.
}

// --- Game Loop ---
function gameLoop() {
    if (!gameActive) return;

    moveSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }

    drawBoard();
    drawFood();
    drawSnake();
}

// --- Handle User Input (will be in a separate step) ---

// --- Start Game ---
function startGame() {
    // Ensure initial food placement is valid
    placeFood();
    // Initial draw
    drawBoard();
    drawFood();
    drawSnake();
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);

    // Hide start screen
    if (startScreen) {
        startScreen.style.display = 'none';
    }
}

// --- Handle User Input ---
let gameStarted = false; // Flag to ensure startGame is called only once

document.addEventListener('keydown', (event) => {
    if (!gameActive && event.key !== 'Enter' && event.key !== ' ') { // Allow restart via button even if game over
        // If game is over, only restart button should work, or specific keys if we add them
        if (gameOverScreen.style.display === 'block') return;
    }

    const keyPressed = event.key;
    let newDx = dx;
    let newDy = dy;

    switch (keyPressed) {
        case 'ArrowUp':
            if (dy === 0) { // Prevent moving directly opposite
                newDx = 0;
                newDy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                newDx = 0;
                newDy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) { // Prevent moving directly opposite
                newDx = -1;
                newDy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                newDx = 1;
                newDy = 0;
            }
            break;
        default:
            return; // Ignore other keys
    }

    // Check if a valid move was made (i.e., dx or dy changed)
    if (newDx !== dx || newDy !== dy) {
        dx = newDx;
        dy = newDy;
        if (!gameStarted && gameActive) {
            startGame();
            gameStarted = true;
        }
    }
});

// Event Listeners
restartButton.addEventListener('click', () => {
    gameStarted = false; // Reset for next game
    restartGame();
});

// Initialize game visuals but don't start the loop yet
drawBoard();
drawFood();
drawSnake();
scoreDisplay.textContent = score;
console.log("Game initialized. Press an arrow key to start.");
