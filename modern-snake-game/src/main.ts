// src/main.ts
import './style.css';
import { Game } from './Game';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;

if (canvas) {
    // Define grid parameters
    const GRID_COLUMNS = 20;
    const GRID_ROWS = 15;
    const CELL_SIZE = 20; // pixels

    canvas.width = GRID_COLUMNS * CELL_SIZE;
    canvas.height = GRID_ROWS * CELL_SIZE;

    // Pass the canvas to the Game constructor
    const game = new Game(GRID_COLUMNS, GRID_ROWS, CELL_SIZE, canvas);
    
    // Initial render for the start screen
    // The Game constructor now initializes the renderer and food.
    // The Renderer.render method will be called to display the initial state (e.g., START_SCREEN message).
    // If game.resetGame() is called in constructor or if renderer is called immediately,
    // it should show the initial state.
    // Let's explicitly call render to ensure the START_SCREEN message is shown.
    game.renderer.render(game); // Render the initial state (e.g. "Press Start")

    console.log('Game initialized. Renderer should display the start screen message.');
    console.log('Snake initial position:', game.snake.getHead());
    console.log('Initial food position:', game.food.getPosition());

    // Placeholder for future UI interaction (buttons, keyboard listeners)
    // Example: document.getElementById('start-button')?.addEventListener('click', () => game.startGame());
    // Input handling will be added in a later part.

} else {
    console.error('Canvas element not found!');
}

// Remove #app div content if it was part of the default template
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (appDiv) {
    appDiv.innerHTML = '';
}
