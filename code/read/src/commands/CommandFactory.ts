import { AppContext } from "../state/AppContext";
import { Command } from "./Command";
import { GotoCommand } from "./GotoCommand";
import { LinkCommand } from "./LinkCommand";

export class CommandFactory {
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
