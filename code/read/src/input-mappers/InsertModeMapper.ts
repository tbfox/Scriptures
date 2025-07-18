import type { CommandModeActions } from "../actions/CommandModeActions";
import type { Input } from "../Input";
import { InputMapper } from "./InputMapper";

export class InsertModeMapper extends InputMapper {
    constructor(input: Input, actions: CommandModeActions) {
        super(input, actions);
    }
    act() {
        if (this.input.isExit()) this.actions.cancel();
        else if (this.input.isAction()) this.actions.enter();
        else this.actions.addToBuffer(this.input.getRawKey());
    }
}
