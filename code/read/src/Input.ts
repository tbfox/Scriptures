import type { Mode } from "../types/Mode";

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

    isNext = () => this.match(["\x1b[C", "l"]);
    isPrev = () => this.match(["\x1b[D", "h"]);
    isGoTo = () => this.is("g");

    private is = (key: string) => this.key === key;
    private match = (keys: string[]) => keys.includes(this.key);
}
