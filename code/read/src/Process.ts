import { Cursor } from "./render/lib/Cursor";

export class Process {
    private originalMode = process.stdin.isRaw;
    start() {
        process.stdin.setRawMode(true);
        process.stdin.resume(); // Start listening

        Cursor.hide();

        process.on("exit", this.quit);
        process.on("SIGINT", this.quit); // Handle Ctrl+C specifically
        process.on("SIGTERM", this.quit); // Handle termination signals
    }

    quit() {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(this.originalMode); // Restore raw mode setting
            process.stdin.pause(); // Stop listening for input
        }
        Cursor.show();
        process.exit(); // Exit the process
    }
}
