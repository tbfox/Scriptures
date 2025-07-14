import type { Resource } from "./state/Resource";
import { Renderer } from "./render/Renderer";
import { State } from "./state/State";
import { Process } from "./Process";
import { Input } from "./Input";
import { NavMode } from "./modes/NavMode";
import { SelectMode } from "./modes/SelectMode";
import { InsertMode } from "./modes/InsertMode";
import { makeMode } from "./modes/ModeFactory";

export class App {
    private proc = new Process();
    private renderer = new Renderer();
    private state: State;
    constructor(ref: Resource) {
        this.state = new State(ref);
        this.renderer.draw(this.state.getState());
        this.proc.start();
    }
    private onStdin = (chunk: Buffer) => {
        const input = new Input(chunk);
        if (input.isHardQuit()) {
            this.proc.quit();
            return;
        }

        this.state.clearError();

        const mode = makeMode(input, this.state);
        mode.handleInput();

        this.renderer.draw(this.state.getState());
    };
    private onResize = () => {
        this.renderer.draw(this.state.getState());
    };
    stdInDataHandler = () => {
        return this.onStdin;
    };
    resizeHandler = () => {
        return this.onResize;
    };
}
