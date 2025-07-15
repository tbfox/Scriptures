import type { AppContext } from "../state/AppContext";
import { Actions } from "./Actions";

export class SelectModeActions extends Actions {
    constructor(public context: AppContext) {
        super(context);
    }
    inc(): void {
        const verseSize = this.context.nav.getState().text.split(" ").length;
        if (
            this.context.selectedWord !== null &&
            this.context.selectedWord < verseSize - 1
        )
            this.context.selectedWord++;
    }
    dec(): void {
        if (
            this.context.selectedWord !== null &&
            this.context.selectedWord >= 1
        )
            this.context.selectedWord--;
    }
    toggleBookMark(): void {
        const ref = this.context.nav.getState().ref;
        if (this.context.bm.has(ref)) this.context.bm.remove(ref);
        else this.context.bm.add(ref);
    }
    save = () => this.context.bm.save();
    startLinking(): void {
        this.context.mode = "command";
        this.context.inputAction = "link";
    }
    enterNavMode(): void {
        this.context.mode = "nav";
        this.context.selectedWord = null;
    }
}
