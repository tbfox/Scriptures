import { AppContext } from "../state/AppContext";
import { GotoCommand } from "./GotoCommand";
import { LinkCommand } from "./LinkCommand";

export abstract class Command {
    constructor(protected context: AppContext) {}
    abstract run(): void;
    static make(context: AppContext): Command {
        if (context.commandType === "link") {
            return new LinkCommand(context);
        }
        if (context.commandType === "goto") {
            return new GotoCommand(context);
        }
        return new GotoCommand(context);
    }
}
