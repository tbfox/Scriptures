import type { ReferenceStruct } from "../types/ReferenceStruct";
import { determineSource } from "./file-queries/determineSource";
import { DncNavigator } from "./navigators/DncNavigator";
import type { ResourceNavigator } from "../types/ResourceNavigator";
import { StandardNavigator } from "./navigators/StandardNavigator";
import { BookMarks } from "./Bookmarks";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
    isUnsaved: boolean;
};

export class State {
    private bm = new BookMarks();
    private nav: ResourceNavigator;
    private error: string | null = null;
    private source: string | null;
    constructor(ref: ReferenceStruct) {
        this.bm.load();
        this.source = determineSource(ref.book);
        if (this.source === "dnc") {
            this.nav = new DncNavigator(this.source, ref);
        } else {
            this.nav = new StandardNavigator(this.source, ref);
        }
    }
    toggleBookMark() {
        const ref = this.nav.getState().ref;
        if (this.bm.has(ref)) {
            this.bm.remove(ref);
        } else {
            this.bm.add(ref);
        }
    }
    save = () => this.bm.save();
    inc = () => this.nav.nextVerse();
    dec = () => this.nav.prevVerse();
    getState(): OutputState {
        const { text, ref } = this.nav.getState();
        return {
            verseReference: ref,
            verseText: text,
            error: this.error,
            isBookMarked: this.bm.has(ref),
            isUnsaved: this.bm.hasUnsaved(),
        };
    }
}
