import { readFileSync } from "fs";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../types/ResourceNavigator";
import { Resource } from "../state/Resource";
import { getVerseMetadata } from "../file-queries/getVerseMetadata";
import type { VerseData } from "../../types/VerseData";
import { Books } from "../state/util/Books";

export class StandardNavigator implements ResourceNavigator {
    navigatorType: NavigatorType = "std";
    private work: string;
    private book: string;
    private chapter: number;
    private verse: number;

    constructor(work: string, ref: Resource) {
        this.work = work;
        this.book = ref.book;
        this.chapter = ref.chapter;
        this.verse = ref.verse;
    }
    goTo = (ref: Resource) => {};
    nextVerse() {
        this.verse += 1;
        const { verses, chapters } = getVerseMetadata(this.getPath());
        if (this.verse > verses) {
            this.verse = 1;
            this.chapter += 1;
            if (this.chapter > chapters) {
                this.book = Books.next(this.work, this.book);
                if (this.book === '__end__'){
                    this.book = Books.first(this.work)
                }
                this.chapter = 1;
            }
        }
    }
    prevVerse() {
        this.verse -= 1;
        if (this.verse === 0) {
            this.chapter -= 1;
            if (this.chapter === 0) {
                this.book = Books.prev(this.work, this.book);
                if (this.book === '__start__'){
                    this.book = Books.last(this.work);
                }
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
            ref: Resource.getId(this.getCurrent()),
        };
    }
    getCurrent(): Resource {
        return new Resource(this.book, this.chapter, this.verse);
    }
    private getPath() {
        return `works/${this.work}/${this.book}/${this.chapter}/${this.verse}.txt`;
    }
    private getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}
