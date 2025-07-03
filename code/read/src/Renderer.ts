import type { OutputState } from "./State";

export class Renderer {
    draw(state: OutputState) {
        clearScreen();
        const numberStr: string = state.num.toString();
        const terminalWidth: number = process.stdout.columns || 80; // Default to 80 if not available
        const terminalHeight: number = process.stdout.rows || 24; // Default to 24 if not available

        // Calculate the row and column to center the number
        const row: number = Math.floor(terminalHeight / 2);
        const col: number =
            Math.floor(terminalWidth / 2) - Math.floor(numberStr.length / 2);

        // Move cursor to the calculated position and write the number
        // \x1b[{row};{col}H moves the cursor to the specified row and column
        process.stdout.write(`\x1b[${row};${col}H${numberStr}`);
    }
}

function clearScreen(): void {
    process.stdout.write("\x1b[2J\x1b[H");
}
