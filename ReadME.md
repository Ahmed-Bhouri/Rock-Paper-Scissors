# Terminal Rock-Paper-Scissors Game

A web-based terminal-style Rock-Paper-Scissors game that mimics the look and feel of a macOS terminal. Play against the computer in a best-of-3 or best-of-5 match format.

## Features

- 🎮 Interactive terminal interface
- 💻 macOS-style terminal design
- 🎯 Best-of-3 or Best-of-5 game modes
- 📊 Game history and statistics
- ⌨️ Command history with up/down arrows
- ✨ Typing animation effects

## Commands

- `start [--rounds=3|5]` - Start a new game (default: best of 3)
- `help` - Show available commands
- `scoreboard` - View game history and statistics
- `clear` - Clear the terminal screen
- `reset-scoreboard` - Reset game history

## During Game Commands

- `r` or `rock` - Choose Rock
- `p` or `paper` - Choose Paper
- `s` or `scissors` - Choose Scissors
- `quit` - Exit current game

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technologies

- Vanilla JavaScript
- Vite
- Local Storage for game persistence
- CSS Animations

## License

All Rights Reserved © 2025


## Author

the best part is that it was vibe codedddd!

here was the prompt given to the bolt.new:
Create a simple web app that looks like a MacOS terminal window. Inside, it behaves like a command-line interface (CLI).
Users can type commands like start --rounds=3 to start a rock-paper-scissors game against the computer (best of 3 or best of 5).
At each round, the CLI asks the user to choose between (r)ock, (p)aper, or (s)cissors.
After the game ends, show the final score.
There should be a scoreboard command to display a history of past games.
There should be a help command to explain available commands.
The design should have a centered terminal window with a black background, soft shadows, rounded corners, and a simple sans-serif font.
Keep the project organized: use separate files for HTML, CSS, and JavaScript.
Use vanilla JavaScript (no frameworks).
Bonus: Slight typing animation when the computer replies.


