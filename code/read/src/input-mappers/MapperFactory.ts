import type { Input } from "../Input";
import type { AppContext } from "../state/AppContext";
import { InsertModeMapper } from "./InsertModeMapper";
import type { InputMapper } from "./InputMapper";
import { NavModeMapper } from "./NavModeMapper";
import { SelectModeMapper } from "./SelectModeMapper";
import { CommandModeActions } from "../actions/CommandModeActions";
import { SelectModeActions } from "../actions/SelectModeActions";
import { NavModeActions } from "../actions/NavModeActions";

export class InputMapperFactory {
    static make(input: Input, context: AppContext): InputMapper {
        const mode = context.mode;
        if (mode === "command")
            return this.makeInsertModeMapper(input, context);
        if (mode === "select") return this.makeSelectModeMapper(input, context);
        return this.makeNavModeMapper(input, context);
    }
    private static makeInsertModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new CommandModeActions(context);
        return new InsertModeMapper(input, s);
    }
    private static makeSelectModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new SelectModeActions(context);
        return new SelectModeMapper(input, s);
    }
    private static makeNavModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new NavModeActions(context);
        return new NavModeMapper(input, s);
    }
}
