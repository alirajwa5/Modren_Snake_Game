// src/Game.ts

import { Grid } from './Grid';
import { Snake, Direction } from './Snake';
import { Food } from './Food';
import { Renderer } from './Renderer';
import { InputHandler } from './InputHandler';
import { UI } from './UI';

// Define the key for localStorage
const HIGH_SCORE_KEY = 'modernSnakeHighScore';

export type GameState = 'START_SCREEN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export class Game {
    grid: Grid;
    snake: Snake;
    food: Food;
    renderer: Renderer;
    inputHandler: InputHandler;
    ui: UI;
    gameState: GameState;
    score: number;
    highScore: number = 0;
    gameLoopId: number | null;
    gameSpeed: number;
    lastUpdateTime: number;

    // Sound properties
    eatSound: HTMLAudioElement;
    gameOverSound: HTMLAudioElement;
    isMuted: boolean = false;

    constructor(gridWidth: number, gridHeight: number, cellSize: number, canvas: HTMLCanvasElement) {
        this.grid = new Grid(gridWidth, gridHeight, cellSize);
        this.snake = new Snake(gridWidth, gridHeight);
        this.food = new Food(this.grid);
        this.renderer = new Renderer(canvas, this.grid);
        
        this.gameState = 'START_SCREEN';
        this.score = 0;
        this.loadHighScore(); // Load high score from localStorage
        
        this.ui = new UI(this); // UI initialized after highScore is loaded
        this.inputHandler = new InputHandler(this);
        
        this.gameLoopId = null;
        this.gameSpeed = 200;
        this.lastUpdateTime = 0;
        
        this.eatSound = new Audio('/assets/sounds/eat.wav');
        this.gameOverSound = new Audio('/assets/sounds/gameOver.wav');

        this.food.respawn(this.snake.getBody());
        this.ui.updateUI(this.gameState, this.score, this.highScore); // Initial UI update with loaded high score
    }

    loadHighScore(): void {
        const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
        this.highScore = storedHighScore ? parseInt(storedHighScore, 10) : 0;
    }

    saveHighScore(): void {
        localStorage.setItem(HIGH_SCORE_KEY, this.highScore.toString());
    }

    playSound(sound: HTMLAudioElement): void {
        if (!this.isMuted) {
            sound.currentTime = 0; // Rewind to start
            sound.play().catch(error => {
                // Log warning if user interaction is required, or for other errors
                console.warn("Error playing sound:", sound.src, error);
            });
        }
    }

    toggleMute(): void {
        this.isMuted = !this.isMuted;
        // TODO: Save isMuted to localStorage if implementing persistence
        // localStorage.setItem('snakeGameMuted', this.isMuted.toString());
        this.ui.updateMuteButton(this.isMuted);
    }

    startGame(): void {
        if (this.gameState === 'PLAYING') return;

        this.gameState = 'PLAYING';
        this.lastUpdateTime = performance.now();
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        this.gameLoop();
        this.ui.updateUI(this.gameState, this.score, this.highScore);
    }

    pauseGame(): void {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            this.ui.updateUI(this.gameState, this.score, this.highScore);
        }
    }

    resumeGame(): void {
        if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            this.lastUpdateTime = performance.now();
            if (!this.gameLoopId) {
                this.gameLoop();
            }
            this.ui.updateUI(this.gameState, this.score, this.highScore);
        }
    }

    gameOver(): void {
        if (this.gameState === 'GAME_OVER') return;
        this.gameState = 'GAME_OVER';
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
        this.playSound(this.gameOverSound); // Play game over sound
        this.ui.updateUI(this.gameState, this.score, this.highScore);
        console.log(`Game Over! Final Score: ${this.score}`);
    }

    gameLoop(timestamp: number = performance.now()): void {
        if (this.gameState !== 'PLAYING') {
            if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
            return;
        }

        const deltaTime = timestamp - this.lastUpdateTime;

        if (deltaTime >= this.gameSpeed) {
            this.lastUpdateTime = timestamp - (deltaTime % this.gameSpeed);
            this.snake.updatePosition();

            const snakeHead = this.snake.getHead();
            if (this.grid.isOutside(snakeHead) || this.snake.isCollidingWithSelf()) {
                this.gameOver(); // This will also call ui.updateUI
                return;
            }

            if (this.food.getPosition().x === snakeHead.x && this.food.getPosition().y === snakeHead.y) {
                this.score++;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.saveHighScore(); // Save new high score
                }
                this.snake.grow();
                this.food.respawn(this.snake.getBody());
                this.playSound(this.eatSound);
                if (this.score % 5 === 0 && this.gameSpeed > 50) {
                    this.gameSpeed = Math.max(50, this.gameSpeed - 15);
                }
            }
            this.renderer.render(this); // Render game elements (snake, food, grid)
            this.ui.updateUI(this.gameState, this.score, this.highScore); // Update HTML UI elements
        }
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    resetGame(): void {
        this.snake.reset(this.grid.width, this.grid.height);
        this.score = 0;
        // High score is not reset, it persists. UI will load it.
        this.food.respawn(this.snake.getBody());
        this.gameState = 'START_SCREEN';
        this.gameSpeed = 200;
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
        this.ui.updateUI(this.gameState, this.score, this.highScore);
    }

    handleInput(newDirection: Direction): void {
        if (this.gameState === 'PLAYING') {
            this.snake.changeDirection(newDirection);
        }
    }
}
