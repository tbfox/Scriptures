import type { NavModeActions } from "../actions/NavModeActions";
import type { Input } from "../Input";
import type { InputMapper } from "./InputMapper";

export class NavModeMapper implements InputMapper {
    constructor(private input: Input, private state: NavModeActions) {}
    map() {
        if (this.input.isNext()) this.state.inc();
        else if (this.input.isPrev()) this.state.dec();
        else if (this.input.isEnterInsertMode()) this.state.enterInsertMode();
        else if (this.input.isBookMark()) this.state.toggleBookMark();
        else if (this.input.isSave()) this.state.save();
        else if (this.input.isEnterSelectMode()) this.state.enterSelectMode();
        else if (this.input.isGoTo()) this.state.goTo();
    }
}
