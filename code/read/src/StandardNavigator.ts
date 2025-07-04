import { readFileSync } from "fs";
import { getVerseMetadata } from "./getVerseMetadata";
import { getNextBook, getPrevBook } from "./Books";

type VerseData = {
    work: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
};

export class StandardNavigator {
    private work: string;
    private book: string;
    private chapter: number;
    private verse: number;

    constructor(work: string, book: string, chapter: number, verse: number) {
        this.work = work;
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
    }

    getNextVerse() {
        this.verse += 1;
        const { verses, chapters } = getVerseMetadata(this.getPath());
        if (this.verse > verses) {
            this.verse = 1;
            this.chapter += 1;
            if (this.chapter > chapters) {
                this.book = getNextBook(this.book);
                this.chapter = 1;
            }
        }
    }
    getPrevVerse() {
        this.verse -= 1;
        if (this.verse === 0) {
            this.chapter -= 1;
            if (this.chapter === 0) {
                this.book = getPrevBook(this.book);
                this.chapter = 1;
                this.verse = 1;
                const { chapters } = getVerseMetadata(this.getPath());
                this.chapter = chapters;
            }
            const { verses } = getVerseMetadata(this.getPath());
            this.verse = verses;
        }
    }
    getState(): VerseData {
        return {
            work: this.work,
            book: this.book,
            chapter: this.chapter,
            verse: this.verse,
            text: this.getScripture(),
        };
    }
    private getPath() {
        return `works/${this.work}/${this.book}/${this.chapter}/${this.verse}.txt`;
    }
    getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}

// "works/bom/alma/32/25.txt";
