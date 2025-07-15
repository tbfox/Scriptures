import type { Input } from "../Input";
import type { AppContext } from "../state/AppContext";
import { InsertModeMapper } from "./InsertModeMapper";
import type { InputMapper } from "./InputMapper";
import { NavModeMapper } from "./NavModeMapper";
import { WordModeMapper as WordModeMapper } from "./WordModeMapper";
import { CommandModeActions } from "../actions/CommandModeActions";
import { WordModeActions } from "../actions/WordModeActions";
import { NavModeActions } from "../actions/NavModeActions";

export class InputMapperFactory {
    static make(input: Input, context: AppContext): InputMapper {
        const mode = context.mode;
        if (mode === "command")
            return this.makeInsertModeMapper(input, context);
        if (mode === "word") return this.makeWordModeMapper(input, context);
        return this.makeNavModeMapper(input, context);
    }
    private static makeInsertModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new CommandModeActions(context);
        return new InsertModeMapper(input, s);
    }
    private static makeWordModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new WordModeActions(context);
        return new WordModeMapper(input, s);
    }
    private static makeNavModeMapper(
        input: Input,
        context: AppContext
    ): InputMapper {
        const s = new NavModeActions(context);
        return new NavModeMapper(input, s);
    }
}
