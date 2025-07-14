import type { Input } from "../Input";
import type { State } from "../state/State";
import type { Mode } from "./Mode";

export class NavMode implements Mode {
    constructor(private input: Input, private state: State) {}
    handleInput() {
        if (this.input.isNext()) this.state.inc();
        else if (this.input.isPrev()) this.state.dec();
        else if (this.input.isEnterInsertMode()) this.state.enterInsertMode();
        else if (this.input.isBookMark()) this.state.toggleBookMark();
        else if (this.input.isSave()) this.state.save();
        else if (this.input.isEnterSelectMode()) this.state.enterSelectMode();
        else if (this.input.isGoTo()) this.state.goTo();
    }
}
