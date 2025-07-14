import type { Input } from "../Input";
import type { InsertModeState } from "../state/modes/InsertModeState";
import type { Mode } from "./Mode";

export class InsertMode implements Mode {
    constructor(private input: Input, private state: InsertModeState) {}
    handleInput() {
        if (this.input.isExitKey()) this.state.cancel();
        else if (this.input.isActionKey()) this.state.enter();
        else this.state.addToBuffer(this.input.getRawKey());
    }
}
