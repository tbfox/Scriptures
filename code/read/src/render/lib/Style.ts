const PRE = `\x1b[`;
const POST = `m`;
const BG = `48;5;`;
const FG = `38;5;`;
export class Style {
    static reset = () => process.stdout.write(PRE + "0" + POST);

    static light = () => process.stdout.write(PRE + "2" + POST);
    static normal = () => process.stdout.write(PRE + "22" + POST);
    static strong = () => process.stdout.write(PRE + "" + POST);

    static italic = () => process.stdout.write(PRE + "3" + POST);
    static rmItalic = () => process.stdout.write(PRE + "23" + POST);
    static underline = () => process.stdout.write(PRE + "4" + POST);
    static rmUnderline = () => process.stdout.write(PRE + "24" + POST);
    static blink = () => process.stdout.write(PRE + "5" + POST);

    static rmBlink = () => process.stdout.write(PRE + "25" + POST);

    static strikethrough = () => process.stdout.write(PRE + "9" + POST);
    static rmStrikethrough = () => process.stdout.write(PRE + "29" + POST);

    static bg = (n: number) => process.stdout.write(PRE + BG + n + POST);
    static rmBg = () => process.stdout.write(PRE + "49" + POST);
    static fg = (n: number) => process.stdout.write(PRE + FG + n + POST);
    static rmFg = () => process.stdout.write(PRE + "39" + POST);
}
