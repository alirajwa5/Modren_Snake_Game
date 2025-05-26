# Modern Snake Game

A classic Snake game rebuilt with modern web technologies (TypeScript, Vite, HTML5 Canvas).

## Features

*   Classic snake gameplay: control the snake to eat food and grow.
*   Smooth movement and animations.
*   Score and High Score tracking (persistent high score using `localStorage`).
*   Keyboard controls (Arrow keys or WASD).
*   Basic touch controls (swipe to move).
*   Sound effects for key game events (eating, game over) with a mute option.
*   Sleek, minimalist visual style.
*   Responsive UI elements.

## Project Structure

*   `src/`: Contains all TypeScript source code.
    *   `main.ts`: Main entry point.
    *   `Game.ts`: Core game logic, state management, game loop.
    *   `Snake.ts`: Snake properties, movement, growth.
    *   `Grid.ts`: Game grid definition and utilities.
    *   `Food.ts`: Food properties and placement.
    *   `Renderer.ts`: Canvas rendering logic.
    *   `InputHandler.ts`: Keyboard and touch input management.
    *   `UI.ts`: HTML UI elements management (score, messages, buttons).
    *   `style.css`: Styles for HTML elements.
*   `public/`: Static assets.
    *   `assets/sounds/`: Sound effect files.
*   `index.html`: Main HTML file.
*   `vite.config.ts`: Vite configuration.
*   `tsconfig.json`: TypeScript configuration.
*   `.eslintrc.cjs`: ESLint configuration.
*   `.prettierrc.json`: Prettier configuration.

## Setup and Installation

1.  **Clone the repository (or ensure you have the project files).**
2.  **Navigate to the project directory:**
    ```bash
    cd modern-snake-game
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Development

To run the development server with hot module replacement (HMR):

```bash
npm run dev
```

This will typically start the server on `http://localhost:5173`.

## Build

To build the project for production:

```bash
npm run build
```

The production-ready files will be output to the `dist/` directory. You can preview the production build locally using `npm run preview`.

## Linting and Formatting

*   To lint the code:
    ```bash
    npm run lint
    ```
*   To format the code using Prettier:
    ```bash
    npm run format
    ```
