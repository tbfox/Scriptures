const ESC = `\x1b`;

export class Screen {
    erase = () => process.stdout.write(`${ESC}[2J`);
    height = () => process.stdout.columns || 80;
    width = () => process.stdout.rows || 24;
}
