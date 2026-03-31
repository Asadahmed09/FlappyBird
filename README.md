# Flappy Bird React

A modern, responsive Flappy Bird clone built with React, TypeScript, and Tailwind CSS.

## Features

- **Smooth 60fps Gameplay**: Optimized canvas rendering for high performance.
- **Multiple Game Modes**:
  - Classic: The original experience.
  - Time Attack: Score as much as possible in 60 seconds.
  - Survival: Speed increases as you score.
  - Practice: No game over (invincible).
- **Leaderboard**: Local storage-based high scores.
- **Combo System**: Pass pipes quickly to build combos and increase score.
- **Mobile Friendly**: Touch controls and responsive design.

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

- `src/components/Game`: Core game rendering and logic.
- `src/components/UI`: User interface components (ScoreBoard, Leaderboard, etc).
- `src/hooks`: Custom hooks for game engine and state management.
- `src/utils`: Helper functions and constants.
- `src/contexts`: Global state management.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- HTML5 Canvas

## License

MIT
