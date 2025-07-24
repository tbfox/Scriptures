import type { CommandType } from "../../types/CommandType";
import type { ModeType } from "../../types/ModeType";
import type { OutputState } from "../../types/OutputState";
import type { ResourceNavigator } from "../../types/ResourceNavigator";
import { Navigator } from "./navigators/Navigator";
import { BookMarks } from "./Bookmarks";
import { Links } from "./Links";
import { Resource } from "./Resource";

export class AppContext {
    public bm = new BookMarks();
    public links = new Links();
    public nav: ResourceNavigator;
    public error: string | null = null;
    public mode: ModeType = "nav";
    public prevMode: ModeType = "nav";
    public commandType: CommandType = null;
    public selectedWord: number | null = null;
    public buffer: string = "";
    constructor(ref: Resource) {
        this.bm.load();
        this.mode = "nav";
        this.nav = new Navigator(ref);
    }
    modeChanged = () => this.prevMode !== this.mode;
    updatePrevMode = () => {
        this.prevMode = this.mode;
    };
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
            showInsertBuffer: this.mode === "command",
            selectedWord: this.selectedWord,
            inputAction: this.commandType,
            links: this.links.getState(res),
        };
    }
}
