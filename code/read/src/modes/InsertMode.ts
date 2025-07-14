import type { Input } from "../Input";
import type { State } from "../state/State";
import type { Mode } from "./Mode";

export class InsertMode implements Mode {
    constructor(private input: Input, private state: State) {}
    handleInput() {
        if (this.input.isExitKey()) this.state.cancel();
        else if (this.input.isActionKey()) this.state.enter();
        else this.state.addToBuffer(this.input.getRawKey());
    }
}
