import type { AppContext } from "../state/AppContext";
import { Actions } from "./Actions";
import { Command } from "../commands/Command";
import { CommandFactory } from "../commands/CommandFactory";

export class CommandModeActions extends Actions {
    private command: Command;
    constructor(public context: AppContext) {
        super(context);
        this.command = CommandFactory.make(context);
    }
    cancel() {
        this.context.buffer = "";
        this.context.mode = "nav";
    }
    addToBuffer(key: string) {
        if (key === "\b" || key === "\x08" || key === "\x7F")
            this.context.buffer = this.context.buffer.slice(0, -1);
        else this.context.buffer = this.context.buffer + key;
    }
    enter() {
        try {
            this.command.run();
        } catch {
            this.context.error = `there was an issue parsing '${this.context.buffer}'`;
        } finally {
            this.context.buffer = "";
            this.context.commandType = null;
            this.context.mode = "nav";
            this.context.selectedWord = null;
        }
    }
}
