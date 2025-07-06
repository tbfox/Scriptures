import { readFileSync } from "fs";
import type { ResourceNavigator } from "../../types/ResourceNavigator";
import type { ReferenceStruct } from "../../types/ReferenceStruct";
import { getVerseMetadata } from "../file-queries/getVerseMetadata";
import { getNextBook, getPrevBook } from "../Books";
import type { VerseData } from "../../types/VerseData";

export class StandardNavigator implements ResourceNavigator {
    private work: string;
    private book: string;
    private chapter: number;
    private verse: number;

    constructor(work: string, ref: ReferenceStruct) {
        this.work = work;
        this.book = ref.book;
        this.chapter = ref.chapter;
        this.verse = ref.verse;
    }

    nextVerse() {
        this.verse += 1;
        const { verses, chapters } = getVerseMetadata(this.getPath());
        if (this.verse > verses) {
            this.verse = 1;
            this.chapter += 1;
            if (this.chapter > chapters) {
                this.book = getNextBook(this.work, this.book);
                this.chapter = 1;
            }
        }
    }
    prevVerse() {
        this.verse -= 1;
        if (this.verse === 0) {
            this.chapter -= 1;
            if (this.chapter === 0) {
                this.book = getPrevBook(this.work, this.book);
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
            ref: `${this.book} ${this.chapter}:${this.verse}`,
        };
    }
    private getPath() {
        return `works/${this.work}/${this.book}/${this.chapter}/${this.verse}.txt`;
    }
    getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}
