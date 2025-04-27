class GameStorage {
    constructor() {
        this.storageKey = 'rps_game_history';
    }

    getGames() {
        try {
            const storedGames = localStorage.getItem(this.storageKey);
            return storedGames ? JSON.parse(storedGames) : [];
        } catch (error) {
            console.error('Error loading game history:', error);
            return [];
        }
    }

    saveGame(gameData) {
        try {
            const games = this.getGames();
            games.push(gameData);
            localStorage.setItem(this.storageKey, JSON.stringify(games));
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing game history:', error);
            return false;
        }
    }

    getWinRate() {
        const games = this.getGames();
        if (games.length === 0) return { played: 0, wonByPlayer: 0, winRate: 0 };

        const wonByPlayer = games.filter(game => game.winner === 'player').length;
        const winRate = (wonByPlayer / games.length) * 100;

        return {
            played: games.length,
            wonByPlayer,
            winRate: Math.round(winRate * 10) / 10 // Round to 1 decimal place
        };
    }
}