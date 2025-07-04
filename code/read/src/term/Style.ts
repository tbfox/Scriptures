const PRE = `\x1b[`;
const POST = `m`;
const BG = `48;5;`;
const FG = `38;5;`;
export class Style {
    reset = () => process.stdout.write(PRE + "0" + POST);

    light = () => process.stdout.write(PRE + "2" + POST);
    normal = () => process.stdout.write(PRE + "22" + POST);
    strong = () => process.stdout.write(PRE + "" + POST);

    italic = () => process.stdout.write(PRE + "3" + POST);
    rmItalic = () => process.stdout.write(PRE + "23" + POST);
    underline = () => process.stdout.write(PRE + "4" + POST);
    rmUnderline = () => process.stdout.write(PRE + "24" + POST);
    blink = () => process.stdout.write(PRE + "5" + POST);
    rmBlink = () => process.stdout.write(PRE + "25" + POST);
    strikethrough = () => process.stdout.write(PRE + "9" + POST);
    rmStrikethrough = () => process.stdout.write(PRE + "29" + POST);

    bg = (n: number) => process.stdout.write(PRE + BG + n + POST);
    rmBg = () => process.stdout.write(PRE + "49" + POST);
    fg = (n: number) => process.stdout.write(PRE + FG + n + POST);
    rmFg = () => process.stdout.write(PRE + "39" + POST);
}
