# Agent Instructions for Modren_Snake_Game

This project is a simple Snake game implemented in HTML, CSS, and JavaScript.

## Running the Game

1.  Ensure you have all three files: `index.html`, `style.css`, and `script.js` in the same directory.
2.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Edge, Safari).
3.  The game will display a start screen. Press any arrow key (Up, Down, Left, Right) to begin playing.

## Gameplay

*   Use the **arrow keys** to control the direction of the snake.
*   The objective is to guide the snake to eat the red food blocks.
*   Each time the snake eats food, it grows longer, and your score increases.
*   The game ends if the snake collides with the walls of the game area or with its own body.
*   The game speed will increase as your score gets higher.
*   After a game over, you can click the "Restart Game" button to play again.

## Development Notes

*   **`index.html`**: Contains the main structure of the game page, including the canvas for the game, score display, game over screen, and start screen.
*   **`style.css`**: Contains all the styling for the game elements, layout, and appearance.
*   **`script.js`**: Contains all the game logic:
    *   Canvas setup and drawing functions.
    *   Snake movement and growth.
    *   Food placement.
    *   Collision detection.
    *   Score management.
    *   Game state management (start, game over, restart).
    *   Input handling (keyboard controls).
    *   Game speed mechanics.
    *   (Conceptual) Sound effect placeholders.

## Future Enhancements / Agent Tasks

*   **Implement Actual Sound Effects**: The current sound effects in `script.js` (`playEatSound`, `playGameOverSound`) are placeholders (console logs). To implement them:
    1.  Obtain or create short audio files (e.g., `.wav` or `.mp3`) for "eating food" and "game over".
    2.  Add these files to the project directory.
    3.  In `script.js`, uncomment and update the `Audio` object creation lines:
        ```javascript
        // const eatSound = new Audio('path/to/your/eat-sound.wav');
        // const gameOverSound = new Audio('path/to/your/gameover-sound.wav');
        ```
    4.  Ensure the `.play()` methods are called correctly.
*   **Add Touch Controls**: For mobile compatibility, implement touch-based controls. This would involve listening for touch events on the canvas and translating swipe gestures into snake movement commands.
*   **Themes/Skins**: Allow players to choose different color schemes for the snake, food, and board.
*   **Pause Functionality**: Implement a way to pause and resume the game.
*   **High Score Board**: Implement a persistent high score board (e.g., using browser `localStorage`).

When modifying the code, ensure the core gameplay remains intuitive and responsive.
The primary goal is a simple, clean, and enjoyable Snake game experience.
