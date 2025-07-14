import type { Input } from "../Input";
import type { State } from "../state/State";
import { InsertMode } from "./InsertMode";
import type { Mode } from "./Mode";
import { NavMode } from "./NavMode";
import { SelectMode } from "./SelectMode";

export function makeMode(input: Input, state: State): Mode {
    const mode = state.getMode();
    if (mode === "insert") return new InsertMode(input, state);
    if (mode === "select") return new SelectMode(input, state);
    return new NavMode(input, state);
}
