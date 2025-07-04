import type { ReferenceStruct } from "../types/ReferenceStruct";
import { StandardNavigator } from "./StandardNavigator";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
};

export class State {
    private nav: StandardNavigator;
    private error: string | null = null;
    constructor(source: string, ref: ReferenceStruct) {
        this.nav = new StandardNavigator(source, ref);
    }
    inc = () => {
        this.nav.nextVerse();
    };
    dec = () => {
        this.nav.prevVerse();
    };
    getState = (): OutputState => {
        const { book, chapter, verse, text } = this.nav.getState();
        const ref = `${book} ${chapter}:${verse}`;
        return {
            verseReference: ref,
            verseText: `${text}`,
            error: this.error,
        };
    };
}
