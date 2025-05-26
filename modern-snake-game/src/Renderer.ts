// src/Renderer.ts

import { Grid } from './Grid';
import { Snake } from './Snake';
import { Food } from './Food';
import { Game, GameState } from './Game'; // Game is needed for the render method

export class Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    grid: Grid;
    cellSize: number;

    constructor(canvas: HTMLCanvasElement, grid: Grid) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context');
        }
        this.context = ctx;
        this.grid = grid;
        this.cellSize = grid.cellSize;
    }

    clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(): void {
        this.context.strokeStyle = '#eee'; // Light gray for grid lines
        this.context.lineWidth = 0.5;

        for (let i = 0; i <= this.grid.width; i++) {
            this.context.beginPath();
            this.context.moveTo(i * this.cellSize, 0);
            this.context.lineTo(i * this.cellSize, this.canvas.height);
            this.context.stroke();
        }
        for (let j = 0; j <= this.grid.height; j++) {
            this.context.beginPath();
            this.context.moveTo(0, j * this.cellSize);
            this.context.lineTo(this.canvas.width, j * this.cellSize);
            this.context.stroke();
        }
    }

    drawSnake(snake: Snake): void {
        const snakeBody = snake.getBody();
        const head = snake.getHead();
        const segmentRadius = this.cellSize / 4; // For rounded corners

        // Draw body segments
        this.context.fillStyle = '#34C759'; // Modern green for body
        this.context.strokeStyle = '#2A9D45'; // Slightly darker stroke for definition
        this.context.lineWidth = 1;

        for (let i = 1; i < snakeBody.length; i++) {
            const segment = snakeBody[i];
            this.context.beginPath();
            this.context.roundRect(
                segment.x * this.cellSize + 1,
                segment.y * this.cellSize + 1,
                this.cellSize - 2,
                this.cellSize - 2,
                segmentRadius
            );
            this.context.fill();
            this.context.stroke();
        }

        // Draw head
        this.context.fillStyle = '#31A24C'; // Darker green for head
        this.context.strokeStyle = '#257D3A'; // Even darker stroke for head
        this.context.beginPath();
        // Make head slightly larger or more prominent if desired, here just different color + eyes
        this.context.roundRect(
            head.x * this.cellSize + 1,
            head.y * this.cellSize + 1,
            this.cellSize - 2,
            this.cellSize - 2,
            segmentRadius
        );
        this.context.fill();
        this.context.stroke();

        // Draw eyes
        this.context.fillStyle = 'white'; // Eye color
        const eyeRadius = this.cellSize / 8;
        let eye1X, eye1Y, eye2X, eye2Y;

        // Determine eye position based on snake direction (simple version)
        switch (snake.direction) {
            case 'UP':
                eye1X = head.x * this.cellSize + this.cellSize * 0.25;
                eye1Y = head.y * this.cellSize + this.cellSize * 0.25;
                eye2X = head.x * this.cellSize + this.cellSize * 0.75;
                eye2Y = head.y * this.cellSize + this.cellSize * 0.25;
                break;
            case 'DOWN':
                eye1X = head.x * this.cellSize + this.cellSize * 0.25;
                eye1Y = head.y * this.cellSize + this.cellSize * 0.75;
                eye2X = head.x * this.cellSize + this.cellSize * 0.75;
                eye2Y = head.y * this.cellSize + this.cellSize * 0.75;
                break;
            case 'LEFT':
                eye1X = head.x * this.cellSize + this.cellSize * 0.25;
                eye1Y = head.y * this.cellSize + this.cellSize * 0.25;
                eye2X = head.x * this.cellSize + this.cellSize * 0.25;
                eye2Y = head.y * this.cellSize + this.cellSize * 0.75;
                break;
            case 'RIGHT':
                eye1X = head.x * this.cellSize + this.cellSize * 0.75;
                eye1Y = head.y * this.cellSize + this.cellSize * 0.25;
                eye2X = head.x * this.cellSize + this.cellSize * 0.75;
                eye2Y = head.y * this.cellSize + this.cellSize * 0.75;
                break;
        }

        this.context.beginPath();
        this.context.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
        this.context.fill();
    }

    drawFood(food: Food): void {
        const position = food.getPosition();
        const foodRadius = this.cellSize / 3; // Radius for a circular food item
        const foodPulseScale = Math.sin(Date.now() * 0.008) * 0.1 + 0.9; // Gentle pulse: 0.9 to 1.1 scale
        const scaledRadius = foodRadius * foodPulseScale;

        this.context.fillStyle = '#FF3B30'; // Red for food
        this.context.strokeStyle = '#D93228'; // Darker red stroke
        this.context.lineWidth = 1;

        this.context.beginPath();
        this.context.arc(
            position.x * this.cellSize + this.cellSize / 2, // Center X
            position.y * this.cellSize + this.cellSize / 2, // Center Y
            scaledRadius, // Use scaled radius
            0,
            Math.PI * 2
        );
        this.context.fill();
        this.context.stroke();
    }

    // Removed drawScore and drawGameMessage as they are handled by UI.ts

    render(game: Game): void {
        this.clear();
        this.drawGrid();
        
        if (game.food) { // Ensure food exists before drawing
             this.drawFood(game.food);
        }
        this.drawSnake(game.snake);
        // Score and game messages are now handled by UI.ts through HTML elements
    }
}
