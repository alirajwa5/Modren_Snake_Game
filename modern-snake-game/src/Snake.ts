// src/Snake.ts

import { Grid } from './Grid'; // Needed for initial positioning, or pass dimensions

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export class Snake {
    body: { x: number; y: number }[];
    direction: Direction;
    pendingDirection: Direction | null;
    private hasGrown: boolean = false;

    constructor(gridWidth: number, gridHeight: number, initialLength: number = 3) {
        const startX = Math.floor(gridWidth / 2);
        const startY = Math.floor(gridHeight / 2);

        this.body = [];
        for (let i = 0; i < initialLength; i++) {
            // Snake starts horizontally, head to the right
            this.body.push({ x: startX - i, y: startY });
        }

        this.direction = 'RIGHT';
        this.pendingDirection = null;
    }

    updatePosition(): void {
        if (this.pendingDirection) {
            // Check if the pending direction is valid (not an immediate reversal)
            const head = this.getHead();
            const nextHead = { ...head };
            
            // Apply pending direction temporarily to see if it's a reversal
            let canChangeDirection = true;
            if (this.direction === 'UP' && this.pendingDirection === 'DOWN') canChangeDirection = false;
            if (this.direction === 'DOWN' && this.pendingDirection === 'UP') canChangeDirection = false;
            if (this.direction === 'LEFT' && this.pendingDirection === 'RIGHT') canChangeDirection = false;
            if (this.direction === 'RIGHT' && this.pendingDirection === 'LEFT') canChangeDirection = false;
            
            if (canChangeDirection) {
                this.direction = this.pendingDirection;
            }
            this.pendingDirection = null; // Reset pending direction
        }

        const head = { ...this.getHead() }; // Shallow copy

        switch (this.direction) {
            case 'UP':
                head.y -= 1;
                break;
            case 'DOWN':
                head.y += 1;
                break;
            case 'LEFT':
                head.x -= 1;
                break;
            case 'RIGHT':
                head.x += 1;
                break;
        }

        this.body.unshift(head); // Add new head

        if (this.hasGrown) {
            this.hasGrown = false; // Reset growth flag
        } else {
            this.body.pop(); // Remove tail segment if not grown
        }
    }

    changeDirection(newDirection: Direction): void {
        // Prevent immediate reversal by only setting pendingDirection
        // The actual change will be processed in updatePosition to ensure it's valid
        // relative to the direction *at the time of update*.
        if (this.direction === 'UP' && newDirection === 'DOWN') return;
        if (this.direction === 'DOWN' && newDirection === 'UP') return;
        if (this.direction === 'LEFT' && newDirection === 'RIGHT') return;
        if (this.direction === 'RIGHT' && newDirection === 'LEFT') return;
        
        this.pendingDirection = newDirection;
    }

    grow(): void {
        this.hasGrown = true;
    }

    getHead(): { x: number; y: number } {
        return this.body[0];
    }

    isCollidingWithSelf(): boolean {
        const head = this.getHead();
        // Check if the head's position matches any other body segment's position
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    getBody(): { x: number; y: number }[] {
        return this.body;
    }

    reset(gridWidth: number, gridHeight: number, initialLength: number = 3): void {
        const startX = Math.floor(gridWidth / 2);
        const startY = Math.floor(gridHeight / 2);

        this.body = [];
        for (let i = 0; i < initialLength; i++) {
            this.body.push({ x: startX - i, y: startY });
        }
        this.direction = 'RIGHT';
        this.pendingDirection = null;
        this.hasGrown = false;
    }
}
