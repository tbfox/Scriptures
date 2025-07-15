import { readFileSync } from "fs";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../../types/ResourceNavigator";
import { getVerseMetadata } from "../../file-queries/getVerseMetadata";
import type { VerseData } from "../../../types/VerseData";
import { OrderedSources } from "../../file-queries/OrderedSources";
import { Resource } from "../Resource";

export class StandardNavigator implements ResourceNavigator {
    navigatorType: NavigatorType = "std";
    private work: string;
    private source: string;
    private chapter: number;
    private verse: number;

    constructor(work: string, ref: Resource) {
        this.work = work;
        this.source = ref.source;
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
                this.source = OrderedSources.next(this.work, this.source);
                if (this.source === "__end__") {
                    this.source = OrderedSources.first(this.work);
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
                this.source = OrderedSources.prev(this.work, this.source);
                if (this.source === "__start__") {
                    this.source = OrderedSources.last(this.work);
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
            source: this.source,
            chapter: this.chapter,
            verse: this.verse,
            text: this.getScripture(),
            ref: Resource.getId(this.getCurrent()),
        };
    }
    getCurrent(): Resource {
        return new Resource(this.source, this.chapter, this.verse);
    }
    private getPath() {
        return `works/${this.work}/${this.source}/${this.chapter}/${this.verse}.txt`;
    }
    private getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}
