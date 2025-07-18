import type { WordModeActions } from "../actions/WordModeActions";
import type { Input } from "../Input";
import { InputMapper } from "./InputMapper";

export class WordModeMapper extends InputMapper {
    constructor(input: Input, actions: WordModeActions) {
        super(input, actions);
    }
    act() {
        if (this.input.isNext()) this.actions.inc();
        else if (this.input.isPrev()) this.actions.dec();
        else if (this.input.isBookMark()) this.actions.toggleBookMark();
        else if (this.input.isSave()) this.actions.save();
        else if (this.input.isLink()) this.actions.startLinking();
        else if (this.input.isSoftQuit()) this.actions.enterNavMode();
        else if (this.input.isFollow()) this.actions.enterNavMode();
    }
}
