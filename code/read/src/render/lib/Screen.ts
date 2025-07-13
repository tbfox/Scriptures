const ESC = `\x1b`;

export class Screen {
    static erase = () => process.stdout.write(`${ESC}[2J`);
    static height = () => process.stdout.rows || 24;
    static width = () => process.stdout.columns || 80;
}
