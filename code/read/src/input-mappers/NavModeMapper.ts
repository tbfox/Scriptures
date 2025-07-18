import type { NavModeActions } from "../actions/NavModeActions";
import type { Input } from "../Input";
import { InputMapper } from "./InputMapper";

export class NavModeMapper extends InputMapper {
    constructor(input: Input, actions: NavModeActions) {
        super(input, actions);
    }
    act() {
        if (this.input.isNext()) this.actions.inc();
        else if (this.input.isPrev()) this.actions.dec();
        else if (this.input.isBookMark()) this.actions.toggleBookMark();
        else if (this.input.isSave()) this.actions.save();
        else if (this.input.isSelect()) this.actions.enterWordMode();
        else if (this.input.isGoTo()) this.actions.goTo();
    }
}
