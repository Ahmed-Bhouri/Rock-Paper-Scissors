class RockPaperScissorsGame {
    constructor(terminal, storage) {
        this.terminal = terminal;
        this.storage = storage;
        this.rounds = 3; // Default is best of 3
        this.playerScore = 0;
        this.computerScore = 0;
        this.currentRound = 0;
        this.choices = ['rock', 'paper', 'scissors'];
        this.gameActive = false;
        this.gameStartTime = null;
    }

    async start(rounds = 3) {
        if (this.gameActive) {
            await this.terminal.printWarning("A game is already in progress!");
            return;
        }

        this.rounds = parseInt(rounds);
        if (isNaN(this.rounds) || this.rounds < 1) {
            await this.terminal.printError("Invalid number of rounds. Using default (3).");
            this.rounds = 3;
        }

        this.playerScore = 0;
        this.computerScore = 0;
        this.currentRound = 0;
        this.gameActive = true;
        this.gameStartTime = new Date();

        const roundsToWin = Math.ceil(this.rounds / 2);

        await this.terminal.printInfo(`Starting a new Rock-Paper-Scissors game (best of ${this.rounds})`);
        await this.terminal.printInfo(`First to win ${roundsToWin} rounds wins the game.`);
        await this.terminal.printLine("Commands during game:", "info-output");
        await this.terminal.printLine(" • Type 'r' for Rock", "info-output");
        await this.terminal.printLine(" • Type 'p' for Paper", "info-output");
        await this.terminal.printLine(" • Type 's' for Scissors", "info-output");
        await this.terminal.printLine(" • Type 'quit' to end the game", "info-output");

        await this.playRound();
    }

    async playRound() {
        if (!this.gameActive) return;

        this.currentRound++;
        await this.terminal.printLine(`\n-- Round ${this.currentRound} --`, "info-output");

        const playerChoice = await this.getPlayerChoice();
        if (!playerChoice) return; // Player quit

        const computerChoice = this.getComputerChoice();
        await this.terminal.printLine(`Computer chose: ${computerChoice}`, "system-output");

        const result = this.determineWinner(playerChoice, computerChoice);
        await this.showRoundResult(playerChoice, computerChoice, result);

        await this.updateScore(result);

        const gameResult = this.checkGameEnd();

        if (gameResult === null && this.gameActive) {
            // Continue to next round
            await this.playRound();
        } else if (gameResult !== null) {
            // Game ended
            await this.endGame(gameResult);
        }
    }

    async getPlayerChoice() {
        let validChoice = false;
        let playerChoice = null;

        while (!validChoice && this.gameActive) {
            const input = await this.terminal.waitForInput("Choose (r)ock, (p)aper, or (s)cissors: ");

            if (input === 'quit') {
                await this.terminal.printWarning("Game abandoned.");
                this.gameActive = false;
                return null;
            }

            switch (input.toLowerCase()) {
                case 'r':
                case 'rock':
                    playerChoice = 'rock';
                    validChoice = true;
                    break;
                case 'p':
                case 'paper':
                    playerChoice = 'paper';
                    validChoice = true;
                    break;
                case 's':
                case 'scissors':
                    playerChoice = 'scissors';
                    validChoice = true;
                    break;
                default:
                    await this.terminal.printError("Invalid choice! Please choose (r)ock, (p)aper, or (s)cissors.");
            }
        }

        if (playerChoice) {
            await this.terminal.printLine(`You chose: ${playerChoice}`, "game-choice");
        }

        return playerChoice;
    }

    getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }

        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        }

        return 'computer';
    }

    async showRoundResult(playerChoice, computerChoice, result) {
        if (result === 'tie') {
            await this.terminal.printInfo("It's a tie!");
        } else if (result === 'player') {
            await this.terminal.printSuccess(`You win! ${playerChoice} beats ${computerChoice}.`);
        } else {
            await this.terminal.printError(`Computer wins! ${computerChoice} beats ${playerChoice}.`);
        }
    }

    async updateScore(result) {
        if (result === 'player') {
            this.playerScore++;
        } else if (result === 'computer') {
            this.computerScore++;
        }

        await this.terminal.printLine(`Score: You ${this.playerScore} - ${this.computerScore} Computer`, "info-output");
    }

    checkGameEnd() {
        const roundsToWin = Math.ceil(this.rounds / 2);

        if (this.playerScore >= roundsToWin) {
            return 'player';
        }

        if (this.computerScore >= roundsToWin) {
            return 'computer';
        }

        return null; // Game continues
    }

    async endGame(winner) {
        this.gameActive = false;
        const gameEndTime = new Date();
        const gameDuration = Math.floor((gameEndTime - this.gameStartTime) / 1000); // in seconds

        await this.terminal.printLine("\n-- Game Over --", "info-output");

        if (winner === 'player') {
            await this.terminal.printSuccess(`Congratulations! You won the game ${this.playerScore}-${this.computerScore}.`);
        } else {
            await this.terminal.printError(`Computer won the game ${this.computerScore}-${this.playerScore}. Better luck next time!`);
        }

        // Record game in history
        const gameData = {
            timestamp: new Date().toISOString(),
            duration: gameDuration,
            rounds: this.rounds,
            playerScore: this.playerScore,
            computerScore: this.computerScore,
            winner: winner
        };

        this.storage.saveGame(gameData);
        await this.terminal.printInfo("Game saved to scoreboard. Type 'scoreboard' to view game history.");
    }
}