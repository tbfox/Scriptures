import { Resource } from "./Resource";
import type { ResourceNavigator } from "../../types/ResourceNavigator";
import { BookMarks } from "./Bookmarks";
import type { Mode } from "../../types/Mode";
import { Navigator } from "../navigators/Navigator";
import { Links } from "./Links";

export type InputAction = null | "goto" | "link";
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
    links: number[];
};

export class State {
    private bm = new BookMarks();
    private links = new Links();
    private nav: ResourceNavigator;
    private error: string | null = null;
    private mode: Mode;
    private inputAction: InputAction = null;
    private selectedWord: number | null = null;
    private buffer: string = "";
    constructor(ref: Resource) {
        this.bm.load();
        this.mode = "nav";
        this.nav = new Navigator(ref);
    }
    enter() {
        if (this.mode === "insert") {
            this.onEnterWhileInInsert();
        }
    }
    private onEnterWhileInInsert() {
        if (this.inputAction === "goto") {
            try {
                const ref = Resource.parse(this.buffer);
                this.nav.goTo(ref);
            } catch {
                this.error = `there was an issue parsing '${this.buffer}'`;
            } finally {
                this.buffer = "";
                this.inputAction = null;
                this.mode = "nav";
            }
        } else if (this.inputAction === "link") {
            try {
                if (this.selectedWord === null || this.selectedWord < 0)
                    throw "Cannot create link with no word selected";
                const res = Resource.parse(this.buffer);
                this.links.add({
                    from: this.nav.getCurrent(),
                    to: res,
                    word: this.selectedWord,
                });
            } catch {
                this.error = `there was an issue parsing '${this.buffer}'`;
            } finally {
                this.buffer = "";
                this.inputAction = null;
                this.mode = "nav";
                this.selectedWord = null;
            }
        }
    }

    cancel() {
        if (this.mode === "insert") {
            this.buffer = "";
            this.mode = "nav";
        }
    }
    startLinking() {
        this.mode = "insert";
        this.inputAction = "link";
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
        const verseSize = this.nav.getState().text.split(" ").length;
        if (this.selectedWord !== null && this.selectedWord < verseSize - 1)
            this.selectedWord++;
    };
    decWord = () => {
        if (this.selectedWord !== null && this.selectedWord >= 1)
            this.selectedWord--;
    };
    getMode = () => this.mode;
    getState(): OutputState {
        const { text } = this.nav.getState();
        const res = this.nav.getCurrent();
        return {
            verseReference: Resource.getId(res),
            verseText: text,
            error: this.error,
            isBookMarked: this.bm.has(Resource.getId(res)),
            isUnsaved: this.bm.hasUnsaved(),
            buffer: this.buffer,
            showInsertBuffer: this.mode === "insert",
            selectedWord: this.selectedWord,
            inputAction: this.inputAction,
            links: this.links.getState(res),
        };
    }
    clearError() {
        this.error = null;
    }
}
