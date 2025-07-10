const ESC = `\x1b`;
export class Cursor {
    static home = () => process.stdout.write(`${ESC}[H`);
    static jumpTo = (c: number, l: number) =>
        process.stdout.write(`${ESC}[${l};${c}H`);
    static up = (n: number) => process.stdout.write(`${ESC}[${n}A`);
    static down = (n: number) => process.stdout.write(`${ESC}[${n}B`);
    static right = (n: number) => process.stdout.write(`${ESC}[${n}C`);
    static left = (n: number) => process.stdout.write(`${ESC}[${n}D`);
    static toColumn = (n: number) => process.stdout.write(`${ESC}[${n}G`);
    static hide = () => process.stdout.write(`${ESC}[?25l`); // hide cursor
    static show = () => process.stdout.write(`${ESC}[?25h`);
}
