import { readFileSync } from "fs";
import { getDncMetadata } from "../file-queries/getVerseMetadata";
import { Resource } from "../state/Resource";
import type { VerseData } from "../../types/VerseData";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../types/ResourceNavigator";

export class DncNavigator implements ResourceNavigator {
    navigatorType: NavigatorType = "dnc";
    private section: number;
    private verse: number;

    constructor(ref: Resource) {
        this.section = ref.chapter;
        this.verse = ref.verse;
    }
    goTo(ref: Resource) {
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
        if (this.section === 1 && this.verse === 1) {
            this.section = 138;
            this.verse = 60;
            return;
        }
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
            ref: Resource.getId(this.getCurrent()),
        };
    }
    getCurrent(): Resource {
        return new Resource(this.navigatorType, this.section, this.verse);
    }
    private getPath() {
        return `works/dnc/${this.section}/${this.verse}.txt`;
    }
    private getScripture = () => {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    };
}
