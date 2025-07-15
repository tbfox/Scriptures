import type { CommandModeActions } from "../actions/CommandModeActions";
import type { Input } from "../Input";
import type { InputMapper } from "./InputMapper";

export class InsertModeMapper implements InputMapper {
    constructor(private input: Input, private state: CommandModeActions) {}
    act() {
        if (this.input.isExitKey()) this.state.cancel();
        else if (this.input.isActionKey()) this.state.enter();
        else this.state.addToBuffer(this.input.getRawKey());
    }
}
