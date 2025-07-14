export class Input {
    private key: string;
    constructor(chunk: Buffer) {
        this.key = chunk.toString();
    }
    isActionKey = () => this.match(["\r", "\n"]);
    isEnterInsertMode = () => this.is("i");
    isEnterSelectMode = () => this.is("w");
    isExitKey = () => this.is("\x1b");

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
