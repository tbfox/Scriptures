import type { ReferenceStruct } from "../types/ReferenceStruct";
import type { ResourceNavigator } from "../types/ResourceNavigator";
import { BookMarks } from "./Bookmarks";
import type { Mode } from "../types/Mode";
import { Navigator } from "./navigators/Navigator";

export type InputAction = null | "goto";
export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
    isUnsaved: boolean;
    showInsertBuffer: boolean;
    buffer: string;
    selectedWord: number | null;
    inputAction: InputAction;
};

export class State {
    private bm = new BookMarks();
    private nav: ResourceNavigator;
    private error: string | null = null;
    private mode: Mode;
    private inputAction: InputAction = null;
    private selectedWord: number | null = null;
    private buffer: string = "";
    constructor(ref: ReferenceStruct) {
        this.bm.load();
        this.mode = "nav";
        this.nav = new Navigator(ref);
    }
    enter() {
        if (this.mode === "insert" && this.inputAction === "goto") {
            this.nav.goTo({ book: "alma", chapter: 32, verse: 25 });
            this.buffer = "";
            this.mode = "nav";
            this.inputAction = null;
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
        if (this.bm.has(ref)) this.bm.remove(ref);
        else this.bm.add(ref);
    }
    enterInsertMode() {
        this.mode = "insert";
    }

    enterSelectMode() {
        this.selectedWord = 0;
        this.mode = "select";
    }
    enterNavMode() {
        this.mode = "nav";
        this.selectedWord = null;
    }
    save = () => this.bm.save();
    inc = () => this.nav.nextVerse();
    dec = () => this.nav.prevVerse();
    goTo = () => {
        this.mode = "insert";
        this.inputAction = "goto";
    };
    incWord = () => {
        if (this.selectedWord !== null) this.selectedWord++;
    };
    decWord = () => {
        if (this.selectedWord !== null) this.selectedWord--;
    };
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
            selectedWord: this.selectedWord,
            inputAction: this.inputAction,
        };
    }
}
