import type { InputAction } from "../../types/InputAction";
import type { ModeType } from "../../types/ModeType";
import type { OutputState } from "../../types/OutputState";
import type { ResourceNavigator } from "../../types/ResourceNavigator";
import { Navigator } from "../navigators/Navigator";
import { BookMarks } from "./components/Bookmarks";
import { Links } from "./components/Links";
import { Resource } from "./components/Resource";

export class AppContext {
    public bm = new BookMarks();
    public links = new Links();
    public nav: ResourceNavigator;
    public error: string | null = null;
    public mode: ModeType = "nav";
    public inputAction: InputAction = null;
    public selectedWord: number | null = null;
    public buffer: string = "";
    constructor(ref: Resource) {
        this.bm.load();
        this.mode = "nav";
        this.nav = new Navigator(ref);
    }
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
}
