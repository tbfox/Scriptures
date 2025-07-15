import type { AppContext } from "../state/AppContext";
import { Resource } from "../state/Resource";
import { Actions } from "./Actions";

export class CommandModeActions extends Actions {
    constructor(public context: AppContext) {
        super(context);
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
        this.onEnterWhileInInsert();
    }
    private onEnterWhileInInsert() {
        if (this.context.commandType === "goto") {
            try {
                const ref = Resource.parse(this.context.buffer);
                this.context.nav.goTo(ref);
            } catch {
                this.context.error = `there was an issue parsing '${this.context.buffer}'`;
            } finally {
                this.context.buffer = "";
                this.context.commandType = null;
                this.context.mode = "nav";
            }
        } else if (this.context.commandType === "link") {
            try {
                if (
                    this.context.selectedWord === null ||
                    this.context.selectedWord < 0
                )
                    throw "Cannot create link with no word selected";
                const res = Resource.parse(this.context.buffer);
                this.context.links.add({
                    from: this.context.nav.getCurrent(),
                    to: res,
                    word: this.context.selectedWord,
                });
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
}
