// src/Grid.ts

export class Grid {
    readonly width: number; // number of columns
    readonly height: number; // number of rows
    readonly cellSize: number; // size of each cell in pixels

    constructor(width: number, height: number, cellSize: number) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }

    getRandomEmptyCell(occupiedCells: { x: number; y: number }[]): { x: number; y: number } {
        let randomX: number;
        let randomY: number;
        let isOccupied: boolean;

        // Basic protection against infinite loop, though unlikely in Snake
        let attempts = 0;
        const maxAttempts = this.width * this.height; 

        do {
            randomX = Math.floor(Math.random() * this.width);
            randomY = Math.floor(Math.random() * this.height);
            isOccupied = occupiedCells.some(cell => cell.x === randomX && cell.y === randomY);
            attempts++;
            if (attempts > maxAttempts && isOccupied) {
                // This case means the grid is full or nearly full.
                // For Snake, this typically means game over or win.
                // Returning a fallback or throwing an error might be options.
                // For now, log an error and return a potentially occupied cell
                // if all attempts fail (should be handled by game logic earlier).
                console.error("Failed to find an empty cell after max attempts.");
                break; 
            }
        } while (isOccupied);

        return { x: randomX, y: randomY };
    }

    isOutside(position: { x: number; y: number }): boolean {
        return (
            position.x < 0 ||
            position.x >= this.width ||
            position.y < 0 ||
            position.y >= this.height
        );
    }
}
