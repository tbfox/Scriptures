import type { Resource } from "./state/components/Resource";
import { Renderer } from "./render/Renderer";
import { Process } from "./Process";
import { Input } from "./Input";
import { makeMode } from "./modes/makeMode";
import { AppContext } from "./state/AppContext";

export class App {
    private proc = new Process();
    private renderer = new Renderer();
    private context: AppContext;
    constructor(ref: Resource) {
        this.context = new AppContext(ref);
        this.renderer.draw(this.context.getState());
        this.proc.start();
    }
    private onStdin = (chunk: Buffer) => {
        const input = new Input(chunk);
        if (input.isHardQuit()) {
            this.proc.quit();
            return;
        }
        this.context.error = null;

        const mode = makeMode(input, this.context);
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
