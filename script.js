// DOM Elements
const gameArea = document.getElementById('gameArea');
const startScreen = document.getElementById('startScreen');
const gamePlayScreen = document.getElementById('gamePlayScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay'); // In-game score
const finalScoreDisplay = document.getElementById('finalScoreDisplay'); // Game over score

// Game Constants and Variables
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

// --- Screen Management ---
function showScreen(screenElement) {
    const screens = document.querySelectorAll('#gameArea .screen');
    screens.forEach(s => s.classList.remove('active'));
    screenElement.classList.add('active');
    screenElement.style.display = 'flex'; // Ensure it's flex for centering
}

// --- Sound Effects (Conceptual) ---
// In a real scenario, you would use Audio objects:
// const eatSound = new Audio('eat.wav'); // e.g., short crunch
// const gameOverSound = new Audio('gameover.wav'); // e.g., brief, slightly melancholic tone
// const clickSound = new Audio('click.wav'); // e.g., for button presses

function playEatSound() {
    // if (eatSound) eatSound.play();
    console.log("Sound: Eat Food (e.g., crunch/pop)");
}

function playGameOverSound() {
    // if (gameOverSound) gameOverSound.play();
    console.log("Sound: Game Over (e.g., failure jingle)");
}

function playClickSound() {
    // if (clickSound) clickSound.play();
    console.log("Sound: UI Click");
}


// --- Game Board ---
function drawBoard() {
    // The canvas background is styled via CSS (#e8e8e8)
    // Clearing the canvas for redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle, as per Google's style)
    ctx.strokeStyle = '#d0d0d0'; // Slightly darker than canvas bg
    ctx.lineWidth = 0.5; // Thin lines

    for (let i = 1; i < tileCount; i++) { // Start from 1 to avoid drawing on the very edge border
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// --- Snake ---
const snakeColor = '#4285F4'; // Google Blue
const foodColor = '#EA4335';  // Google Red
const foodStemColor = '#34A853'; // Google Green for leaf/stem

function drawSnake() {
    ctx.fillStyle = snakeColor;
    snake.forEach((segment, index) => {
        const segmentX = segment.x * gridSize;
        const segmentY = segment.y * gridSize;
        const cornerRadius = gridSize / 4; // Adjust for desired roundness

        // Draw rounded rectangle for each segment
        ctx.beginPath();
        ctx.moveTo(segmentX + cornerRadius, segmentY);
        ctx.lineTo(segmentX + gridSize - cornerRadius, segmentY);
        ctx.quadraticCurveTo(segmentX + gridSize, segmentY, segmentX + gridSize, segmentY + cornerRadius);
        ctx.lineTo(segmentX + gridSize, segmentY + gridSize - cornerRadius);
        ctx.quadraticCurveTo(segmentX + gridSize, segmentY + gridSize, segmentX + gridSize - cornerRadius, segmentY + gridSize);
        ctx.lineTo(segmentX + cornerRadius, segmentY + gridSize);
        ctx.quadraticCurveTo(segmentX, segmentY + gridSize, segmentX, segmentY + gridSize - cornerRadius);
        ctx.lineTo(segmentX, segmentY + cornerRadius);
        ctx.quadraticCurveTo(segmentX, segmentY, segmentX + cornerRadius, segmentY);
        ctx.closePath();
        ctx.fill();

        // Could add eyes to the head segment for more character
        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            // Simple eyes, adjust based on direction later if desired
            let eyeRadius = gridSize * 0.1;
            let eyeOffsetX = gridSize * 0.25; // Offset from center for horizontal eyes
            let eyeOffsetY = gridSize * 0.25; // Offset from center for vertical eyes

            let eye1X, eye1Y, eye2X, eye2Y;

            if (dx === 1) { // Moving Right
                eye1X = segmentX + gridSize * 0.65; eye1Y = segmentY + gridSize * 0.30;
                eye2X = segmentX + gridSize * 0.65; eye2Y = segmentY + gridSize * 0.70;
            } else if (dx === -1) { // Moving Left
                eye1X = segmentX + gridSize * 0.35; eye1Y = segmentY + gridSize * 0.30;
                eye2X = segmentX + gridSize * 0.35; eye2Y = segmentY + gridSize * 0.70;
            } else if (dy === 1) { // Moving Down
                eye1X = segmentX + gridSize * 0.30; eye1Y = segmentY + gridSize * 0.65;
                eye2X = segmentX + gridSize * 0.70; eye2Y = segmentY + gridSize * 0.65;
            } else { // Moving Up (or default before first move)
                eye1X = segmentX + gridSize * 0.30; eye1Y = segmentY + gridSize * 0.35;
                eye2X = segmentX + gridSize * 0.70; eye2Y = segmentY + gridSize * 0.35;
            }

            ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(eye2X, eye2Y, gridSize * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
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
    const foodX = food.x * gridSize;
    const foodY = food.y * gridSize;
    const appleRadius = gridSize / 2.5; // Make apple mostly fill the cell

    // Draw apple body
    ctx.fillStyle = foodColor; // Google Red
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2, foodY + gridSize / 2, appleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw stem/leaf (simple version)
    ctx.fillStyle = foodStemColor; // Google Green
    ctx.beginPath();
    // A small rectangle for a stem
    ctx.fillRect(foodX + gridSize / 2 - gridSize / 10, foodY + gridSize / 8, gridSize / 5, gridSize / 4);
    // A small circle for a leaf accent
    // ctx.arc(foodX + gridSize / 1.5, foodY + gridSize / 4, gridSize / 8, 0, Math.PI * 2);
    // ctx.fill();
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
    playGameOverSound();
    finalScoreDisplay.textContent = score;
    showScreen(gameOverScreen);
}

// --- Game Initialization and Flow ---
function initializeGameVariables() {
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }]; // Start in center
    placeFood(); // Place food ensuring it's not on the snake
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = initialGameSpeed;
    scoreDisplay.textContent = score;
    gameActive = true;
    gameStarted = false; // Reset for next game session
}

function init() { // Called once on page load
    initializeGameVariables(); // Set up initial state but don't start loop
    drawBoard();
    drawFood();
    drawSnake();
    showScreen(startScreen); // Show start screen initially

    playButton.addEventListener('click', () => {
        playClickSound();
        startGame();
    });
    restartButton.addEventListener('click', () => {
        playClickSound();
        startGame(); // Google's snake typically restarts directly into the game
    });

    document.addEventListener('keydown', handleKeyPress);
    console.log("Game initialized. Press Play or an arrow key to start.");
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

// --- Start Game ---
function startGame() {
    initializeGameVariables(); // Reset all game variables
    showScreen(gamePlayScreen); // Show the game canvas area

    // Initial draw
    drawBoard();
    drawFood();
    drawSnake();

    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    // gameStarted is set to true within handleKeyPress when movement starts
}

// --- Handle User Input ---
// let gameStarted = false; // This is now part of initializeGameVariables

function handleKeyPress(event) {
    if (!gameActive && !startScreen.classList.contains('active')) {
        // If game is not active (e.g. game over) and not on start screen,
        // key presses should not control snake. Restart is via button.
        // However, if on start screen, arrow keys can also start game.
        if (!gameOverScreen.classList.contains('active')) return;
    }

    const keyPressed = event.key;
    let newDx = dx;
    let newDy = dy;
    let isValidKeyPress = false;

    switch (keyPressed) {
        case 'ArrowUp':
            if (dy === 0) { newDx = 0; newDy = -1; isValidKeyPress = true;}
            break;
        case 'ArrowDown':
            if (dy === 0) { newDx = 0; newDy = 1; isValidKeyPress = true;}
            break;
        case 'ArrowLeft':
            if (dx === 0) { newDx = -1; newDy = 0; isValidKeyPress = true;}
            break;
        case 'ArrowRight':
            if (dx === 0) { newDx = 1; newDy = 0; isValidKeyPress = true;}
            break;
        default:
            return; // Ignore other keys
    }

    if (isValidKeyPress) {
        event.preventDefault(); // Prevent arrow keys from scrolling the page

        if (!gameStarted && gameActive) {
            // If on start screen and an arrow key is pressed
            if (startScreen.classList.contains('active')) {
                playClickSound(); // Or a specific "game start" sound
                startGame(); // This will also hide startScreen and show gamePlayScreen
            }
            dx = newDx; // Set initial direction
            dy = newDy;
            gameStarted = true; // Mark game as started to prevent re-triggering startGame on subsequent key presses
        } else if (gameActive) {
            dx = newDx;
            dy = newDy;
        }
    }
}

// Initialize game on script load
init();
