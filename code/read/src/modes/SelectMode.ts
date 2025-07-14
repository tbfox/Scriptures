import type { Input } from "../Input";
import type { AppState } from "../state/AppState";
import type { Mode } from "./Mode";

export class SelectMode implements Mode {
    constructor(private input: Input, private state: AppState) {}
    handleInput() {
        if (this.input.isNext()) this.state.incWord();
        else if (this.input.isPrev()) this.state.decWord();
        else if (this.input.isBookMark()) this.state.toggleBookMark();
        else if (this.input.isSave()) this.state.save();
        else if (this.input.isLink()) this.state.startLinking();
        else if (this.input.isSoftQuit()) this.state.enterNavMode();
        else if (this.input.isFollow()) this.state.enterNavMode();
    }
}
