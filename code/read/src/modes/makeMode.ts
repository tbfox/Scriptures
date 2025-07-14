import type { Input } from "../Input";
import type { AppState } from "../state/AppState";
import { InsertModeState } from "../state/modes/InsertModeState";
import { InsertMode } from "./InsertMode";
import type { Mode } from "./Mode";
import { NavMode } from "./NavMode";
import { SelectMode } from "./SelectMode";

export function makeMode(input: Input, state: AppState): Mode {
    const mode = state.getMode();
    if (mode === "insert") {
        const s = new InsertModeState(state.context);
        return new InsertMode(input, s);
    }
    if (mode === "select") return new SelectMode(input, state);
    return new NavMode(input, state);
}
