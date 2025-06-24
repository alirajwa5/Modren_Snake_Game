# Agent Instructions for Google Snake Clone

This project is a simple Snake game implemented in HTML, CSS, and JavaScript, designed to emulate the look and feel of Google's Snake game.

## Running the Game

1.  Ensure you have all three files: `index.html`, `style.css`, and `script.js` in the same directory.
2.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Edge, Safari).
3.  The game will display a start screen with a "Play" button. Click the "Play" button or press any arrow key (Up, Down, Left, Right) to begin playing.

## Gameplay

*   Use the **arrow keys** to control the direction of the snake.
*   The objective is to guide the snake to eat the red apples.
*   Each time the snake eats food, it grows longer, and your score increases.
*   The game ends if the snake collides with the walls of the game area or with its own body.
*   The game speed will increase as your score gets higher.
*   After a game over, a "Game Over!" screen will appear with your final score. Click the "Play Again" button to start a new game.

## UI/UX (Google Theme)

*   **Visuals:** The game uses a clean, minimalist design inspired by Google's Material Design.
    *   Colors: Google's signature blue for the snake, red for apples, and various grays for UI elements.
    *   Snake: Composed of rounded segments with simple eyes indicating direction.
    *   Food: Styled as red apples with a small green stem.
    *   Board: A light gray grid with subtle grid lines.
*   **Screens:**
    *   **Start Screen:** Features the game title "Snake" and a prominent "Play" button with an icon.
    *   **Game Play Screen:** Displays the game canvas and the current score at the top.
    *   **Game Over Screen:** Shows "Game Over!", your final score, and a "Play Again" button with an icon.
*   **Typography:** Uses system standard sans-serif fonts for clarity.

## Development Notes

*   **`index.html`**: Contains the main structure with three primary screen `divs` (`#startScreen`, `#gamePlayScreen`, `#gameOverScreen`) and SVG icons embedded for buttons.
*   **`style.css`**: Contains all the styling to achieve the Google Material Design look and feel. Manages screen visibility using an `.active` class on the screen `divs`.
*   **`script.js`**: Contains all the game logic:
    *   DOM manipulation for screen transitions (`showScreen` function).
    *   Canvas setup and drawing functions for rounded snake segments and stylized apples.
    *   Snake movement, growth, food placement, collision detection.
    *   Score management and dynamic speed adjustment.
    *   Game state management (initialization, start, game over, restart flow).
    *   Input handling (keyboard controls for snake and starting the game).
    *   (Conceptual) Sound effect placeholders (`playEatSound`, `playGameOverSound`, `playClickSound`).

## Future Enhancements / Agent Tasks

*   **Implement Actual Sound Effects**:
    1.  Source or create short audio files (e.g., `.wav` or `.mp3`) for "eating food," "game over," and "UI click."
    2.  In `script.js`, uncomment and update the `Audio` object creation lines and ensure `.play()` is called.
*   **Settings Panel:**
    *   Add a settings icon/button (placeholder in `index.html`).
    *   Implement a panel to allow users to select:
        *   Snake speed (e.g., Slow, Medium, Fast presets).
        *   Food type (e.g., different fruits, each could have same point value or different).
        *   Board theme/color variations.
*   **Pause Functionality**: Implement a pause button and logic to freeze/resume game state.
*   **Advanced Animations**:
    *   Smoother snake movement (e.g., using `requestAnimationFrame` with sub-grid positioning for visual smoothness, though core logic remains grid-based).
    *   Subtle screen transition animations (e.g., fade-ins/outs for screens).
    *   Small "pop" animation when food is eaten.
*   **Touch Controls**: For mobile compatibility.
*   **High Score Board**: Using browser `localStorage`.

When modifying the code, aim to maintain the clean, Google-inspired aesthetic and intuitive gameplay.Tool output for `overwrite_file_with_block`:
