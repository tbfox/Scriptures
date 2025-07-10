import { Cursor } from "./lib/Cursor";
import { Screen } from "./lib/Screen";
import { Style } from "./lib/Style";

const screen = new Screen();
const cursor = new Cursor();
const style = new Style();

function write(s: string) {
    process.stdout.write(s);
}

export class VerseRenderer {
    private maxWidth = Screen.width();
    private line = 4;
    private col = 1;
    private words: string[];
    private currentWord: number = 0;
    private selectedWord: number | null;
    private links: number[] = [];
    constructor(text: string, selectedWord: number | null, links: number[]) {
        this.words = text.split(" ");
        this.selectedWord = selectedWord;
        this.links = links;
    }

    renderVerse() {
        Cursor.jumpTo(this.col, this.line);
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
        Cursor.jumpTo(this.col, this.line);
    }
    private writeCurrentWord() {
        this.turnOnSelectedWord();
        this.turnOnWordLink();
        write(this.words[this.currentWord]!.toString());
        this.turnOffWordLink();
        this.turnOffSelectedWord();
    }
    private turnOnSelectedWord() {
        if (this.isSelectedWord()) Style.bg(67);
    }
    private turnOffSelectedWord() {
        if (this.isSelectedWord()) Style.rmBg();
    }

    private isSelectedWord = () =>
        this.selectedWord !== null && this.selectedWord === this.currentWord;

    private turnOnWordLink() {
        if (this.wordHasLink()) Style.underline();
    }
    private turnOffWordLink() {
        if (this.wordHasLink()) Style.rmUnderline();
    }

    private wordHasLink = () => this.links.includes(this.currentWord);

    private curWordLength() {
        if (this.words[this.currentWord]!.length === undefined) return 0;
        return this.words[this.currentWord]!.length;
    }
}
