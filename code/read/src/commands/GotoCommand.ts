import type { AppContext } from "../state/AppContext";
import { Resource } from "../state/Resource";
import { Command } from "./Command";

export class GotoCommand extends Command {
    run() {
        const ref = Resource.parse(this.context.buffer);
        this.context.nav.goTo(ref);
    }
}
