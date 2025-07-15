import { Renderer } from "./render/Renderer";
import { Process } from "./Process";
import { Input } from "./Input";
import { makeMode } from "./input-mappers/MapperFactory";
import { AppContext } from "./state/AppContext";
import type { Resource } from "./state/Resource";

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
        mode.map();

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
