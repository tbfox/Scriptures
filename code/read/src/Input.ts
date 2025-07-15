export class Input {
    private key: string;
    constructor(chunk: Buffer) {
        this.key = chunk.toString();
    }
    isExit = () => this.is("\x1b");

    isAction = () => this.match(["\r", "\n"]);
    isSelect = () => this.is("w");

    isHardQuit = () => this.is("\x03");
    isSoftQuit = () => this.is("q");

    isBookMark = () => this.is("m");
    isSave = () => this.is("s");
    isLink = () => this.is("l");
    isFollow = () => this.is("f");

    isNext = () => this.is("\x1b[C");
    isPrev = () => this.is("\x1b[D");
    isGoTo = () => this.is("g");

    private is = (key: string) => this.key === key;
    private match = (keys: string[]) => keys.includes(this.key);
    getRawKey = (): string => this.key;
}
