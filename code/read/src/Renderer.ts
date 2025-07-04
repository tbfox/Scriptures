import type { OutputState } from "./State";

export class Renderer {
    draw({ verseReference, verseText, error }: OutputState) {
        this.clearScreen();
        const terminalWidth: number = process.stdout.columns || 80;
        const terminalHeight: number = process.stdout.rows || 24;

        // Set maximum width for verse text (80% of terminal width, minimum 40)
        const maxLineWidth = Math.max(40, Math.floor(terminalWidth * 0.8));

        // Break verse text into wrapped lines
        const wrappedLines = this.wrapText(verseText, maxLineWidth);

        // Calculate starting row to center the verse text vertically
        const startRow = Math.max(
            1,
            Math.floor((terminalHeight - wrappedLines.length) / 2)
        );

        // Draw verse reference at top left (row 1, col 1)
        process.stdout.write(`\x1b[1;1H${verseReference}`);

        // Draw each line of verse text, centered horizontally
        wrappedLines.forEach((line, index) => {
            const row = startRow + index;
            const col = Math.max(
                1,
                Math.floor((terminalWidth - line.length) / 2)
            );
            process.stdout.write(`\x1b[${row};${col}H${line}`);
        });

        // Draw error at bottom left if present
        if (error !== null) {
            const errorRow = terminalHeight;
            process.stdout.write(`\x1b[${errorRow};1HERROR: ${error}`);
        }
    }

    private wrapText(text: string, maxWidth: number): string[] {
        if (!text || text.length === 0) {
            return [""];
        }

        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
            // If adding this word would exceed the line width
            if (currentLine.length + word.length + 1 > maxWidth) {
                // If we have content on the current line, save it and start a new line
                if (currentLine.length > 0) {
                    lines.push(currentLine.trim());
                    currentLine = word;
                } else {
                    // Word is longer than max width, force it on its own line
                    lines.push(word);
                }
            } else {
                // Add word to current line
                currentLine += (currentLine.length > 0 ? " " : "") + word;
            }
        }

        // Don't forget the last line
        if (currentLine.length > 0) {
            lines.push(currentLine.trim());
        }

        return lines.length > 0 ? lines : [""];
    }

    clearScreen(): void {
        process.stdout.write("\x1b[2J\x1b[H");
    }
}
