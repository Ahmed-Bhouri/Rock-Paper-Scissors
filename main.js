

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the terminal
    const outputElement = document.getElementById('terminal-output');
    const inputElement = document.getElementById('terminal-input');
    const terminal = new Terminal(outputElement, inputElement);

    // Initialize storage
    const storage = new GameStorage();

    // Register commands
    registerCommands(terminal, storage);

    // Initialize terminal and show welcome message
    terminal.initialize();

    setTimeout(async () => {
        await terminal.printInfo('Welcome to the Rock-Paper-Scissors Terminal Game!');
        await terminal.printLine('Type "help" to see available commands.', 'info-output');
        await terminal.printLine('Try "start --rounds=3" to begin a new game.', 'info-output');
    }, 100);

    // Update cursor position initially
    terminal.updateCursorPosition();

    // Focus the input
    inputElement.focus();
});