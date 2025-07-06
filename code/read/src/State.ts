import type { ReferenceStruct } from "../types/ReferenceStruct";
import { determineSource } from "./file-queries/determineSource";
import { DncNavigator } from "./navigators/DncNavigator";
import type { ResourceNavigator } from "../types/ResourceNavigator";
import { StandardNavigator } from "./navigators/StandardNavigator";
import { BookMarks } from "./Bookmarks";
import type { Mode } from "../types/Mode";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
    isUnsaved: boolean;
    showInsertBuffer: boolean;
    buffer: string;
};

export class State {
    private bm = new BookMarks();
    private nav: ResourceNavigator;
    private error: string | null = null;
    private source: string | null;
    private mode: Mode;
    private buffer: string = "";
    constructor(ref: ReferenceStruct) {
        this.bm.load();
        this.source = determineSource(ref.book);
        this.mode = "nav";
        if (this.source === "dnc") {
            this.nav = new DncNavigator(this.source, ref);
        } else {
            this.nav = new StandardNavigator(this.source, ref);
        }
    }
    enter() {
        if (this.mode === "insert") {
            this.buffer = "";
            this.mode = "nav";
        }
    }
    cancel() {
        if (this.mode === "insert") {
            this.buffer = "";
            this.mode = "nav";
        }
    }
    addToBuffer(key: string) {
        if (key === "\b" || key === "\x08" || key === "\x7F")
            this.buffer = this.buffer.slice(0, -1);
        else this.buffer = this.buffer + key;
    }
    toggleBookMark() {
        const ref = this.nav.getState().ref;
        if (this.bm.has(ref)) {
            this.bm.remove(ref);
        } else {
            this.bm.add(ref);
        }
    }
    enterInsertMode() {
        this.mode = "insert";
    }
    enterNavMode() {
        this.mode = "nav";
    }
    save = () => this.bm.save();
    inc = () => this.nav.nextVerse();
    dec = () => this.nav.prevVerse();
    getMode = () => this.mode;
    getState(): OutputState {
        const { text, ref } = this.nav.getState();
        return {
            verseReference: ref,
            verseText: text,
            error: this.error,
            isBookMarked: this.bm.has(ref),
            isUnsaved: this.bm.hasUnsaved(),
            buffer: this.buffer,
            showInsertBuffer: this.mode === "insert",
        };
    }
}
