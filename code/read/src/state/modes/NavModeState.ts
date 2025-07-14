import type { AppContext } from "../AppContext";
import { State } from "../State";

export class NavModeState extends State {
    constructor(public context: AppContext) {
        super(context);
    }
    inc(): void {
        this.context.nav.nextVerse();
    }
    dec(): void {
        this.context.nav.prevVerse();
    }
    enterInsertMode() {
        this.context.mode = "insert";
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
        this.context.mode = "insert";
        this.context.inputAction = "goto";
    };
}
