import type { Input } from "../Input";
import type { AppContext } from "../state/AppContext";
import { InsertModeState } from "../state/modes/InsertModeState";
import { NavModeState } from "../state/modes/NavModeState";
import { SelectModeState } from "../state/modes/SelectModeState";
import type { State } from "../state/State";
import { InsertMode } from "./InsertMode";
import type { Mode } from "./Mode";
import { NavMode } from "./NavMode";
import { SelectMode } from "./SelectMode";

export function makeMode(input: Input, context: AppContext): Mode {
    const mode = context.mode;
    if (mode === "insert") {
        const s = new InsertModeState(context);
        return new InsertMode(input, s);
    }

    if (mode === "select") {
        const s = new SelectModeState(context);
        return new SelectMode(input, s);
    }

    const s = new NavModeState(context);
    return new NavMode(input, s);
}
