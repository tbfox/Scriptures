import { AppContext } from "../state/AppContext";

export abstract class Command {
    constructor(protected context: AppContext) {}
    abstract run(): void;
}
