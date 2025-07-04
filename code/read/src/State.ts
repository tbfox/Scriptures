import type { ReferenceStruct } from "../types/ReferenceStruct";
import { StandardNavigator } from "./StandardNavigator";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
};

export class State {
    private bookmarks: string[] = [];
    private nav: StandardNavigator;
    private error: string | null = null;
    constructor(source: string, ref: ReferenceStruct) {
        this.nav = new StandardNavigator(source, ref);
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
