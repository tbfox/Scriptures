import { Cursor } from "./Cursor";
import { Screen } from "./Screen";
import { Style } from "./Style";

const screen = new Screen();
const cursor = new Cursor();
const style = new Style();

function write(s: string) {
    process.stdout.write(s);
}

export class VerseRenderer {
    private maxWidth = screen.width();
    private line = 2;
    private col = 1;
    private words: string[];
    private currentWord: number = 0;

    constructor(text: string) {
        this.words = text.split(" ");
    }

    renderVerse() {
        cursor.jumpTo(this.col, this.line);
        for (let i = 0; i < this.words.length; i++) {
            this.writeWord();
        }
    }

    private writeWord() {
        let shouldJmp = true;
        if (this.currentWord >= this.words.length) return;
        if (this.curWordLength() + this.col >= this.maxWidth) {
            this.col = 0;
            this.line++;
            shouldJmp = false;
        }
        this.writeCurrentWord();
        if (shouldJmp) {
            this.col += this.curWordLength();
        }
        this.col++;
        this.currentWord++;
        cursor.jumpTo(this.col, this.line);
    }
    private writeCurrentWord() {
        write(this.words[this.currentWord]!.toString());
    }
    private curWordLength() {
        if (this.words[this.currentWord]!.length === undefined) return 0;
        return this.words[this.currentWord]!.length;
    }
}
