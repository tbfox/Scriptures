export class Input {
    private key: string;
    constructor(chunk: Buffer) {
        this.key = chunk.toString();
    }
    next() {}
}
