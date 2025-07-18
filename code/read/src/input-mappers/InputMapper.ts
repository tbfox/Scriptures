import type { ModeType } from "../../types/ModeType";
import type { Actions } from "../actions/Actions";
import type { Input } from "../Input";

export abstract class InputMapper {
    constructor(protected input: Input, protected actions: Actions) {}
    act() {}
    onExitMode = (prevMode: ModeType) => this.actions.onExitMode(prevMode);
    onEnterMode = (prevMode: ModeType) => this.actions.onExitMode(prevMode);
}
