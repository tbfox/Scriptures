export class Input {
    private key: string;
    constructor(chunk: Buffer) {
        this.key = chunk.toString();
    }
    isNext() {
        return this.key === "\x1b[C" || this.key === "l";
    }
    isPrev() {
        return this.key === "\x1b[D" || this.key === "h";
    }
    shouldQuit() {
        return this.key === "\x03" || this.key === "q";
    }
}
