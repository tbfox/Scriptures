import type { OutputState } from "./State";

export class Renderer {
    draw({ verseText, error }: OutputState) {
        clearScreen();
        const terminalWidth: number = process.stdout.columns || 80; // Default to 80 if not available
        const terminalHeight: number = process.stdout.rows || 24; // Default to 24 if not available

        // Calculate the row and column to center the number
        const row: number = Math.floor(terminalHeight / 2);
        const col: number =
            Math.floor(terminalWidth / 2) - Math.floor(verseText.length / 2);

        // Move cursor to the calculated position and write the number
        // \x1b[{row};{col}H moves the cursor to the specified row and column
        let screenText = verseText;
        if (error !== null) {
            screenText = `ERROR: ${error}\n\n\n${verseText}`;
        }
        process.stdout.write(`\x1b[${row};${col}H${screenText}`);
    }
}

function clearScreen(): void {
    process.stdout.write("\x1b[2J\x1b[H");
}
