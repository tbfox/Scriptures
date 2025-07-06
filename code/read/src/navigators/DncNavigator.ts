import { readFileSync } from "fs";
import { getDncMetadata } from "../file-queries/getVerseMetadata";
import type { ReferenceStruct } from "../../types/ReferenceStruct";
import type { VerseData } from "../../types/VerseData";
import type { ResourceNavigator } from "../../types/ResourceNavigator";

export class DncNavigator implements ResourceNavigator {
    private work: string;
    private section: number;
    private verse: number;

    constructor(work: string, ref: ReferenceStruct) {
        this.work = work;
        this.section = ref.chapter;
        this.verse = ref.verse;
    }

    nextVerse() {
        this.verse += 1;
        const { verses, chapters } = getDncMetadata(this.getPath());
        if (this.verse > verses) {
            this.verse = 1;
            this.section += 1;
            if (this.section > chapters) {
                this.section = 1;
            }
        }
    }
    prevVerse() {
        this.verse -= 1;
        if (this.verse === 0) {
            this.section -= 1;
            const { verses } = getDncMetadata(this.getPath());
            this.verse = verses;
        }
    }
    getState(): VerseData {
        return {
            work: "dnc",
            book: "dnc",
            chapter: this.section,
            verse: this.verse,
            text: this.getScripture(),
            ref: `dnc ${this.section}:${this.verse}`,
        };
    }
    private getPath() {
        return `works/${this.work}/${this.section}/${this.verse}.txt`;
    }
    getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}
