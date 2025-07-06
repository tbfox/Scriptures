export class Terminal {
    private originalMode = process.stdin.isRaw;
    constructor() {
        process.stdin.setRawMode(true);
        process.stdin.resume(); // Start listening

        process.stdout.write("\x1b[?25l"); // hide cursor

        process.on("exit", this.quit);
        process.on("SIGINT", this.quit); // Handle Ctrl+C specifically
        process.on("SIGTERM", this.quit); // Handle termination signals
    }

    quit() {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(this.originalMode); // Restore raw mode setting
            process.stdin.pause(); // Stop listening for input
        }
        process.stdout.write("\x1b[?25h"); // Show cursor
        process.exit(); // Exit the process
    }
}
