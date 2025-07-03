import { Input } from "./Input";
import { Renderer } from "./Renderer";
import { State } from "./State";
import { Terminal } from "./Terminal";

export class App {
    private term = new Terminal();
    private renderer = new Renderer();
    private state = new State();
    constructor() {
        this.renderer.draw(this.state.getState());
    }
    private onStdin = (chunk: Buffer) => {
        const input = new Input(chunk);

        if (input.isNext()) this.state.inc();
        else if (input.isPrev()) this.state.dec();
        else if (input.shouldQuit()) this.term.quit();

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
