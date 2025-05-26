// src/UI.ts
import { Game } from './Game'; // Forward declaration, actual import in Game.ts
import type { GameState } from './Game'; // Only import type for GameState

const HIGH_SCORE_KEY = 'snakeHighScore';

export class UI {
    game: Game;

    currentScoreElement: HTMLElement;
    highScoreElement: HTMLElement;
    finalScoreElement: HTMLElement;

    // Main action buttons that were previously in #ui-controls
    startButton: HTMLButtonElement; // This one might be effectively replaced by startGameInitialButton
    pauseButton: HTMLButtonElement;
    resumeButton: HTMLButtonElement; // For a generic resume, if needed. Paused message has its own.
    restartButton: HTMLButtonElement; // For a generic restart, if needed. Game Over has its own.

    // Buttons from specific message overlays
    playAgainButton: HTMLButtonElement; // From game over message
    startGameInitialButton: HTMLButtonElement; // From start screen message
    resumeGameButton: HTMLButtonElement; // From paused message

    // Message elements
    gameOverMessageElement: HTMLElement;
    pausedMessageElement: HTMLElement;
    startScreenMessageElement: HTMLElement;
    
    // General UI controls container (if needed for global visibility toggle)
    uiControlsElement: HTMLElement;
    muteButton: HTMLButtonElement; // Added muteButton


    constructor(game: Game) {
        this.game = game;

        this.currentScoreElement = this.getElement<HTMLElement>('current-score');
        this.highScoreElement = this.getElement<HTMLElement>('high-score');
        this.finalScoreElement = this.getElement<HTMLElement>('final-score');
        this.muteButton = this.getElement<HTMLButtonElement>('mute-button');

        this.startGameInitialButton = this.getElement<HTMLButtonElement>('start-game-initial-button');
        this.pauseButton = this.getElement<HTMLButtonElement>('pause-button');
        this.resumeGameButton = this.getElement<HTMLButtonElement>('resume-game-button');
        this.playAgainButton = this.getElement<HTMLButtonElement>('play-again-button');
        
        try {
            this.startButton = this.getElement<HTMLButtonElement>('start-button');
        } catch (e) { console.warn("Optional element 'start-button' not found."); }
         try {
            this.resumeButton = this.getElement<HTMLButtonElement>('resume-button');
        } catch (e) { console.warn("Optional element 'resume-button' not found."); }
        try {
            this.restartButton = this.getElement<HTMLButtonElement>('restart-button');
        } catch (e) { console.warn("Optional element 'restart-button' not found."); }


        this.gameOverMessageElement = this.getElement<HTMLElement>('game-over-message');
        this.pausedMessageElement = this.getElement<HTMLElement>('paused-message');
        this.startScreenMessageElement = this.getElement<HTMLElement>('start-screen-message');
        this.uiControlsElement = this.getElement<HTMLElement>('ui-controls');


        this.setupButtonListeners();
        // this.loadHighScore(); // Removed, Game.ts now handles loading
        this.updateMuteButton(this.game.isMuted); // Initial mute button text
        // High score display will be updated by the first call to updateUI from Game's constructor
    }

    getElement<T extends HTMLElement>(id: string): T {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`UI element with id '${id}' not found.`);
        }
        return element as T;
    }

    setupButtonListeners(): void {
        this.startGameInitialButton.addEventListener('click', () => {
            this.game.resetGame(); // Ensure game is reset
            this.game.startGame();
        });

        this.pauseButton.addEventListener('click', () => {
            this.game.pauseGame();
        });

        this.resumeGameButton.addEventListener('click', () => {
            this.game.resumeGame();
        });
        
        this.playAgainButton.addEventListener('click', () => {
            this.game.resetGame(); // Ensure game is reset
            this.game.startGame();
        });

        // Add listeners for generic buttons if they exist
        this.startButton?.addEventListener('click', () => {
            this.game.resetGame(); this.game.startGame();
        });
        this.resumeButton?.addEventListener('click', () => {
            this.game.resumeGame();
        });
        this.restartButton?.addEventListener('click', () => {
            this.game.resetGame(); this.game.startGame();
        });

        this.muteButton.addEventListener('click', () => {
            this.game.toggleMute();
        });
    }

    updateMuteButton(isMuted: boolean): void {
        this.muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
        // Optional: Add CSS classes for different visual states (e.g., icon change)
        this.muteButton.classList.toggle('muted', isMuted);
    }

    // Removed loadHighScore and saveHighScore methods. Game.ts handles this.
    
    updateScore(score: number): void {
        this.currentScoreElement.textContent = score.toString();
    }

    updateHighScore(highScore: number): void {
        this.highScoreElement.textContent = highScore.toString();
        // Removed this.saveHighScore(); Game.ts handles saving.
    }

    showGameOverScreen(finalScore: number): void {
        this.finalScoreElement.textContent = finalScore.toString();
        this.gameOverMessageElement.classList.add('visible');
        this.pausedMessageElement.classList.remove('visible');
        this.startScreenMessageElement.classList.remove('visible');
        this.uiControlsElement.style.display = 'none'; // Hide general controls like pause
    }

    showPauseScreen(): void {
        this.pausedMessageElement.classList.add('visible');
        this.gameOverMessageElement.classList.remove('visible');
        this.startScreenMessageElement.classList.remove('visible');
        this.uiControlsElement.style.display = 'none'; 
    }

    showStartScreen(): void {
        this.startScreenMessageElement.classList.add('visible');
        this.gameOverMessageElement.classList.remove('visible');
        this.pausedMessageElement.classList.remove('visible');
        this.uiControlsElement.style.display = 'none';
    }

    showPlayingUI(): void {
        this.startScreenMessageElement.classList.remove('visible');
        this.gameOverMessageElement.classList.remove('visible');
        this.pausedMessageElement.classList.remove('visible');
        
        this.uiControlsElement.style.display = 'block'; // Show pause button container
        this.pauseButton.style.display = 'inline-block';

        // Ensure other generic buttons (if they exist and were part of uiControlsElement) are hidden
        if (this.startButton) this.startButton.style.display = 'none';
        if (this.resumeButton) this.resumeButton.style.display = 'none';
        if (this.restartButton) this.restartButton.style.display = 'none';
    }

    updateUI(gameState: GameState, score: number, highScore: number): void {
        this.updateScore(score);
        if (highScore > (parseInt(this.highScoreElement.textContent || "0", 10))) {
            this.updateHighScore(highScore);
        }

        switch (gameState) {
            case 'START_SCREEN':
                this.showStartScreen();
                break;
            case 'PLAYING':
                this.showPlayingUI();
                break;
            case 'PAUSED':
                this.showPauseScreen();
                break;
            case 'GAME_OVER':
                this.showGameOverScreen(score);
                break;
        }
    }
}
