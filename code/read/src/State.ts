import type { ReferenceStruct } from "../types/ReferenceStruct";
import { determineSource } from "./detremineSource";
import { DncNavigator } from "./DncNavigator";
import type { ResourceNavigator } from "./ResourceNavigator";
import { StandardNavigator } from "./StandardNavigator";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
};

export class State {
    private bookmarks: string[] = [];
    private nav: ResourceNavigator;
    private error: string | null = null;
    private source: string | null;
    constructor(ref: ReferenceStruct) {
        this.source = determineSource(ref.book);
        if (this.source === "dnc") {
            this.nav = new DncNavigator(this.source, ref);
        } else {
            this.nav = new StandardNavigator(this.source, ref);
        }
    }
    toggleBookMark() {
        const ref = this.nav.getState().ref;
        if (this.bookmarks.includes(ref)) {
            this.bookmarks = this.bookmarks.filter((b) => b !== ref);
        } else {
            this.bookmarks.push(ref);
        }
    }
    inc = () => this.nav.nextVerse();
    dec = () => this.nav.prevVerse();
    getState(): OutputState {
        const { text, ref } = this.nav.getState();
        return {
            verseReference: ref,
            verseText: text,
            error: this.error,
            isBookMarked: this.bookmarks.includes(ref),
        };
    }
}
