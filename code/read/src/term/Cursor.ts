const ESC = `\x1b`;
export class Cursor {
    home = () => process.stdout.write(`${ESC}[H`);
    jumpTo = (c: number, l: number) =>
        process.stdout.write(`${ESC}[${l};${c}H`);
    up = (n: number) => process.stdout.write(`${ESC}[${n}A`);
    down = (n: number) => process.stdout.write(`${ESC}[${n}B`);
    right = (n: number) => process.stdout.write(`${ESC}[${n}C`);
    left = (n: number) => process.stdout.write(`${ESC}[${n}D`);
    toColumn = (n: number) => process.stdout.write(`${ESC}[${n}G`);
}
