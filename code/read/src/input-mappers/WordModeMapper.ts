import type { WordModeActions } from "../actions/WordModeActions";
import type { Input } from "../Input";
import type { InputMapper } from "./InputMapper";

export class WordModeMapper implements InputMapper {
    constructor(private input: Input, private state: WordModeActions) {}
    act() {
        if (this.input.isNext()) this.state.inc();
        else if (this.input.isPrev()) this.state.dec();
        else if (this.input.isBookMark()) this.state.toggleBookMark();
        else if (this.input.isSave()) this.state.save();
        else if (this.input.isLink()) this.state.startLinking();
        else if (this.input.isSoftQuit()) this.state.enterNavMode();
        else if (this.input.isFollow()) this.state.enterNavMode();
    }
}
