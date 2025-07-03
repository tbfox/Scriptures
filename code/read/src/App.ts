import { Renderer } from "./Renderer";
import { State } from "./State";
import { Terminal } from "./Terminal";

export class App {
    private term = new Terminal();
    private settings = process.stdin.isRaw;
    private renderer = new Renderer();
    private state = new State();
    constructor() {
        this.renderer.draw(this.state.getState());
    }
    private onStdin = (chunk: Buffer) => {
        const key: string = chunk.toString();

        switch (key) {
            case "\x1b[C":
                this.state.inc();
                break;
            case "\x1b[D":
                this.state.dec();
                break;
            case "\x03":
            case "q":
                this.term.quit();
                return;
            default:
                break;
        }
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
