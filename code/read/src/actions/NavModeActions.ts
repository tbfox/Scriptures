import type { AppContext } from "../state/AppContext";
import { Actions } from "./Actions";

export class NavModeActions extends Actions {
    constructor(public context: AppContext) {
        super(context);
    }
    inc(): void {
        this.context.nav.nextVerse();
    }
    dec(): void {
        this.context.nav.prevVerse();
    }
    enterCommandMode() {
        this.context.mode = "command";
    }
    toggleBookMark() {
        const ref = this.context.nav.getState().ref;
        if (this.context.bm.has(ref)) this.context.bm.remove(ref);
        else this.context.bm.add(ref);
    }
    save = () => this.context.bm.save();
    enterSelectMode() {
        this.context.selectedWord = 0;
        this.context.mode = "select";
    }
    goTo = () => {
        this.context.mode = "command";
        this.context.inputAction = "goto";
    };
}
