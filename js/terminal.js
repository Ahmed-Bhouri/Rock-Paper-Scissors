class Terminal {
    constructor(outputElement, inputElement) {
        this.outputElement = outputElement;
        this.inputElement = inputElement;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commandHandlers = {};
        this.isWaitingForInput = false;
        this.inputCallback = null;
        this.cursorPos = 0;
        this.initialized = false;
        this.typingSpeed = 5; // Reduced from 30 to 10ms for faster typing
    }

    initialize() {
        if (this.initialized) return;

        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputElement.addEventListener('input', this.handleInput.bind(this));

        // Update cursor position based on input
        this.inputElement.addEventListener('input', () => {
            this.updateCursorPosition();
        });

        document.addEventListener('click', () => {
            this.inputElement.focus();
        });

        this.initialized = true;
    }

    updateCursorPosition() {
        const inputRect = this.inputElement.getBoundingClientRect();
        const promptWidth = document.querySelector('.terminal-prompt').getBoundingClientRect().width;

        // Calculate text width up to caret position
        const textBeforeCursor = this.inputElement.value.substring(0, this.inputElement.selectionStart);
        const textWidth = this.getTextWidth(textBeforeCursor);

        const cursor = document.querySelector('.terminal-cursor');
        // Add 1px offset to position cursor after the last character
        cursor.style.left = `${promptWidth + textWidth + 8}px`;
    }

    getTextWidth(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = getComputedStyle(this.inputElement).font;
        return context.measureText(text).width;
    }

    registerCommand(command, handler, description) {
        this.commandHandlers[command] = {
            handler,
            description
        };
    }

    async handleKeyDown(event) {
        if (this.isWaitingForInput) {
            if (event.key === 'Enter') {
                const input = this.inputElement.value.trim().toLowerCase();
                this.inputElement.value = '';
                this.updateCursorPosition();

                if (this.inputCallback) {
                    this.printLine(input, 'user-input', true);
                    const callback = this.inputCallback;
                    this.inputCallback = null;
                    this.isWaitingForInput = false;
                    callback(input);
                }

                event.preventDefault();
            }
            return;
        }

        switch (event.key) {
            case 'Enter':
                const command = this.inputElement.value.trim();
                if (command) {
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    this.printLine(`$ ${command}`, 'user-input');
                    this.executeCommand(command);
                    this.inputElement.value = '';
                    this.updateCursorPosition();
                }
                event.preventDefault();
                break;

            case 'ArrowUp':
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputElement.value = this.commandHistory[this.historyIndex];
                    this.updateCursorPosition();
                    setTimeout(() => {
                        this.inputElement.selectionStart = this.inputElement.selectionEnd = this.inputElement.value.length;
                    }, 0);
                }
                event.preventDefault();
                break;

            case 'ArrowDown':
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.inputElement.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.inputElement.value = '';
                }
                this.updateCursorPosition();
                event.preventDefault();
                break;
        }
    }

    handleInput() {
        this.updateCursorPosition();
    }

    parseCommand(commandStr) {
        const tokens = commandStr.split(/\s+/);
        const command = tokens[0];
        const args = {};

        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.startsWith('--')) {
                const [key, value] = token.substring(2).split('=');
                args[key] = value !== undefined ? value : true;
            } else if (token.startsWith('-')) {
                args[token.substring(1)] = true;
            } else {
                // Positional argument
                if (!args._ ) args._ = [];
                args._.push(token);
            }
        }

        return { command, args };
    }

    async executeCommand(commandStr) {
        const { command, args } = this.parseCommand(commandStr);

        if (this.commandHandlers[command]) {
            try {
                await this.commandHandlers[command].handler(args, this);
            } catch (err) {
                this.printError(`Error executing command: ${err.message}`);
            }
        } else {
            this.printError(`Command not found: ${command}. Type 'help' to see available commands.`);
        }
    }

    async printLine(text, className = 'system-output', skipTyping = false) {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;

        if (skipTyping || className === 'user-input') {
            line.textContent = text;
        } else {
            line.classList.add('typing');
            await this.animateTyping(line, text);
            line.classList.remove('typing');
        }

        this.outputElement.appendChild(line);
        this.scrollToBottom();
        return line;
    }

    async animateTyping(element, text) {
        element.textContent = '';

        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
    }

    printInfo(text) {
        return this.printLine(text, 'info-output');
    }

    printSuccess(text) {
        return this.printLine(text, 'success-output');
    }

    printError(text) {
        return this.printLine(text, 'error-output');
    }

    printWarning(text) {
        return this.printLine(text, 'warning-output');
    }

    async waitForInput(prompt) {
        await this.printLine(prompt, 'system-output');
        this.isWaitingForInput = true;

        return new Promise(resolve => {
            this.inputCallback = resolve;
        });
    }

    clear() {
        this.outputElement.innerHTML = '';
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
}