import type { SelectModeActions } from "../actions/SelectModeActions";
import type { Input } from "../Input";
import type { InputMapper } from "./InputMapper";

export class SelectModeMapper implements InputMapper {
    constructor(private input: Input, private state: SelectModeActions) {}
    map() {
        if (this.input.isNext()) this.state.inc();
        else if (this.input.isPrev()) this.state.dec();
        else if (this.input.isBookMark()) this.state.toggleBookMark();
        else if (this.input.isSave()) this.state.save();
        else if (this.input.isLink()) this.state.startLinking();
        else if (this.input.isSoftQuit()) this.state.enterNavMode();
        else if (this.input.isFollow()) this.state.enterNavMode();
    }
}
