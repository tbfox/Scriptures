import type { Input } from "../Input";
import type { AppContext } from "../state/AppContext";
import { InsertModeMapper } from "./InsertModeMapper";
import type { InputMapper } from "./InputMapper";
import { NavModeMapper } from "./NavModeMapper";
import { SelectModeMapper } from "./SelectModeMapper";
import { InsertModeActions } from "../actions/InsertModeActions";
import { SelectModeActions } from "../actions/SelectModeActions";
import { NavModeActions } from "../actions/NavModeActions";

export class MapperFactory {
    make(input: Input, context: AppContext): InputMapper {
        const mode = context.mode;
        if (mode === "insert") return this.makeInsertModeMapper(input, context);
        if (mode === "select") return this.makeSelectModeMapper(input, context);
        return this.makeNavModeMapper(input, context);
    }
    private makeInsertModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new InsertModeActions(context);
        return new InsertModeMapper(input, s);
    }
    private makeSelectModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new SelectModeActions(context);
        return new SelectModeMapper(input, s);
    }
    private makeNavModeMapper(input: Input, context: AppContext): InputMapper {
        const s = new NavModeActions(context);
        return new NavModeMapper(input, s);
    }
}

export function makeMode(input: Input, context: AppContext): InputMapper {
    const mode = context.mode;
    if (mode === "insert") {
        const s = new InsertModeActions(context);
        return new InsertModeMapper(input, s);
    }

    if (mode === "select") {
        const s = new SelectModeActions(context);
        return new SelectModeMapper(input, s);
    }

    const s = new NavModeActions(context);
    return new NavModeMapper(input, s);
}
