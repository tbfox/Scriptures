import type { ReferenceStruct } from "../types/ReferenceStruct";
import { Input } from "./term/Input";
import { Renderer } from "./term/Renderer";
import { State } from "./State";
import { Terminal } from "./term/Terminal";

export class App {
    private term = new Terminal();
    private renderer = new Renderer();
    private state: State;
    constructor(ref: ReferenceStruct) {
        this.state = new State("bom", ref);
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
