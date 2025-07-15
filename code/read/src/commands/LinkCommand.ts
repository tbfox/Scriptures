import { Resource } from "../state/Resource";
import { Command } from "./Command";

export class LinkCommand extends Command {
    run() {
        if (this.context.selectedWord === null || this.context.selectedWord < 0)
            throw "Cannot create link with no word selected";
        const res = Resource.parse(this.context.buffer);
        this.context.links.add({
            from: this.context.nav.getCurrent(),
            to: res,
            word: this.context.selectedWord,
        });
    }
}
