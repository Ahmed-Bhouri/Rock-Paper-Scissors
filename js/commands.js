function registerCommands(terminal, storage) {
    const game = new RockPaperScissorsGame(terminal, storage);

    // Start command
    terminal.registerCommand('start', async (args) => {
        const rounds = args.rounds || 3;
        await game.start(rounds);
    }, 'Start a new rock-paper-scissors game. Usage: start [--rounds=3|5]');

    // Help command
    terminal.registerCommand('help', async () => {
        await terminal.printInfo('Available commands:');
        await terminal.printLine('  start [--rounds=3|5]  - Start a new rock-paper-scissors game', 'info-output');
        await terminal.printLine('  scoreboard            - Display game history and statistics', 'info-output');
        await terminal.printLine('  clear                 - Clear the terminal screen', 'info-output');
        await terminal.printLine('  help                  - Show this help message', 'info-output');

        await terminal.printInfo('\nDuring a game:');
        await terminal.printLine('  r                     - Choose Rock', 'info-output');
        await terminal.printLine('  p                     - Choose Paper', 'info-output');
        await terminal.printLine('  s                     - Choose Scissors', 'info-output');
        await terminal.printLine('  quit                  - Quit the current game', 'info-output');

        await terminal.printInfo('\nExamples:');
        await terminal.printLine('  start --rounds=5      - Start a best-of-5 game', 'info-output');
    }, 'Show available commands and usage');

    // Scoreboard command
    terminal.registerCommand('scoreboard', async () => {
        const games = storage.getGames();
        const stats = storage.getWinRate();

        if (games.length === 0) {
            await terminal.printWarning('No games played yet. Start a game with the "start" command.');
            return;
        }

        await terminal.printInfo('===== SCOREBOARD =====');
        await terminal.printLine(`Games played: ${stats.played}`, 'info-output');
        await terminal.printLine(`Games won: ${stats.wonByPlayer} (${stats.winRate}%)`, 'info-output');
        await terminal.printLine('=====================', 'info-output');

        await terminal.printInfo('\nRecent games:');

        // Display last 5 games in reverse chronological order
        const recentGames = [...games].reverse().slice(0, 5);

        for (const [index, game] of recentGames.entries()) {
            const date = new Date(game.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const result = game.winner === 'player' ?
                `You won ${game.playerScore}-${game.computerScore}` :
                `Computer won ${game.computerScore}-${game.playerScore}`;

            await terminal.printLine(`${index + 1}. [${formattedDate}] ${result} (Best of ${game.rounds})`, 'system-output');
        }

        if (games.length > 5) {
            await terminal.printInfo(`\n... and ${games.length - 5} more games`);
        }
    }, 'Display game history and statistics');

    // Clear command
    terminal.registerCommand('clear', () => {
        terminal.clear();
    }, 'Clear the terminal screen');

    // Reset scoreboard command
    terminal.registerCommand('reset-scoreboard', async () => {
        if (storage.clearHistory()) {
            await terminal.printSuccess('Scoreboard has been reset.');
        } else {
            await terminal.printError('Failed to reset scoreboard.');
        }
    }, 'Reset the scoreboard and clear game history');
}
