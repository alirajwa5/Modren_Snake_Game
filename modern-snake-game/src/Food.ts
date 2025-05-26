// src/Food.ts

import { Grid } from './Grid';

export class Food {
    position: { x: number; y: number };
    grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
        // Initially, no snake parts to worry about for the very first food.
        // In a real game, the game might start before the snake is placed,
        // or the snake's initial body needs to be passed if it exists.
        // For this setup, assuming food is created before snake or at a known empty spot.
        this.position = this.grid.getRandomEmptyCell([]); 
    }

    getPosition(): { x: number; y: number } {
        return this.position;
    }

    respawn(occupiedCells: { x: number; y: number }[]): void {
        this.position = this.grid.getRandomEmptyCell(occupiedCells);
    }
}
