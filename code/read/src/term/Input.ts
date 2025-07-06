export class Input {
    private key: string;
    constructor(chunk: Buffer) {
        this.key = chunk.toString();
    }
    isBookMark = () => this.key === "m";
    isSave = () => this.key === "s";
    isNext = () => this.key === "\x1b[C" || this.key === "l";
    isPrev = () => this.key === "\x1b[D" || this.key === "h";
    shouldQuit = () => this.key === "\x03" || this.key === "q";
}
