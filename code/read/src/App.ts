import type { Resource } from "./state/components/Resource";
import { Renderer } from "./render/Renderer";
import { AppState } from "./state/AppState";
import { Process } from "./Process";
import { Input } from "./Input";
import { makeMode } from "./modes/makeMode";
import { AppContext } from "./state/AppContext";

export class App {
    private proc = new Process();
    private renderer = new Renderer();
    private state: AppState;
    private context: AppContext;
    constructor(ref: Resource) {
        this.context = new AppContext(ref);
        this.state = new AppState(this.context);
        this.renderer.draw(this.context.getState());
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

        this.renderer.draw(this.context.getState());
    };
    private onResize = () => {
        this.renderer.draw(this.context.getState());
    };
    stdInDataHandler = () => {
        return this.onStdin;
    };
    resizeHandler = () => {
        return this.onResize;
    };
}
