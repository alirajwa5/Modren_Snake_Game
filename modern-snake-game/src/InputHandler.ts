// src/InputHandler.ts

import { Game } from './Game';
import { Direction } from './Snake';

export class InputHandler {
    private game: Game;
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchEndX: number = 0;
    private touchEndY: number = 0;
    private minSwipeDistance: number = 30; // Minimum distance for a swipe to be registered

    // Bound event listener functions
    private boundHandleKeyDown: (event: KeyboardEvent) => void;
    private boundHandleTouchStart: (event: TouchEvent) => void;
    private boundHandleTouchEnd: (event: TouchEvent) => void;

    constructor(game: Game) {
        this.game = game;
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleTouchStart = this.handleTouchStart.bind(this);
        this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    private setupKeyboardListeners(): void {
        window.addEventListener('keydown', this.boundHandleKeyDown);
    }

    private setupTouchListeners(): void {
        // Assuming the canvas is the primary touch target
        this.game.renderer.canvas.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
        this.game.renderer.canvas.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });
        // passive: false might be needed to prevent default scrolling on touch,
        // but use with caution and test for desired behavior.
    }

    private handleKeyDown(event: KeyboardEvent): void {
        let direction: Direction | null = null;

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                direction = 'UP';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                direction = 'DOWN';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                direction = 'LEFT';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                direction = 'RIGHT';
                break;
            case 'Enter':
            case ' ': // Space bar
                if (this.game.gameState === 'START_SCREEN' || this.game.gameState === 'GAME_OVER') {
                    this.game.startGame(); // startGame internally calls resetGame
                }
                event.preventDefault(); // Prevent space from scrolling
                break;
            case 'p':
            case 'P':
                if (this.game.gameState === 'PLAYING') {
                    this.game.pauseGame();
                } else if (this.game.gameState === 'PAUSED') {
                    this.game.resumeGame();
                }
                break;
            default:
                return; // Exit if key is not handled
        }

        if (direction) {
            this.game.handleInput(direction);
        }
    }

    private handleTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) { // Single touch
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
            event.preventDefault(); // Prevent mouse events and scrolling
        }
    }

    private handleTouchEnd(event: TouchEvent): void {
        if (this.touchStartX === 0 && this.touchStartY === 0) return; // No touchstart recorded

        // If there are remaining touches, use the first changed touch; otherwise, it's the end of a swipe.
        // For simplicity, we'll use the first changed touch if available, or assume the swipe ended.
        const touch = event.changedTouches[0]; 
        if(!touch) return; // Should not happen if touchstart was registered

        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;

        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        let direction: Direction | null = null;

        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal swipe
            if (Math.abs(deltaX) > this.minSwipeDistance) {
                direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
            }
        } else { // Vertical swipe
            if (Math.abs(deltaY) > this.minSwipeDistance) {
                direction = deltaY > 0 ? 'DOWN' : 'UP';
            }
        }

        if (direction) {
            this.game.handleInput(direction);
        } else {
            // If not a swipe, consider it a tap (for start/pause/resume, if desired)
            // For now, a tap on canvas could try to start/resume game
            if (this.game.gameState === 'START_SCREEN' || this.game.gameState === 'GAME_OVER') {
                 this.game.startGame();
            } else if (this.game.gameState === 'PLAYING') {
                // Optional: Tap to pause on mobile?
                // this.game.pauseGame(); 
            } else if (this.game.gameState === 'PAUSED') {
                // this.game.resumeGame();
            }
        }
        
        // Reset touch start coordinates
        this.touchStartX = 0;
        this.touchStartY = 0;
        event.preventDefault();
    }

    destroyListeners(): void {
        window.removeEventListener('keydown', this.boundHandleKeyDown);
        this.game.renderer.canvas.removeEventListener('touchstart', this.boundHandleTouchStart);
        this.game.renderer.canvas.removeEventListener('touchend', this.boundHandleTouchEnd);
    }
}
