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
        this.state = new State(ref);
        this.renderer.draw(this.state.getState());
    }
    private onStdin = (chunk: Buffer) => {
        const input = new Input(chunk, this.state.getMode());
        if (input.isHardQuit()) {
            this.term.quit();
            return;
        }

        if (this.state.getMode() === "insert") {
            this.handleInsertMode(input, chunk);
        } else {
            this.handleNavMode(input);
        }

        this.renderer.draw(this.state.getState());
    };
    handleNavMode(input: Input) {
        if (input.isNext()) this.state.inc();
        else if (input.isPrev()) this.state.dec();
        else if (input.isEnterInsertMode()) this.state.enterInsertMode();
        else if (input.isBookMark()) this.state.toggleBookMark();
        else if (input.isSave()) this.state.save();
    }
    handleInsertMode(input: Input, chunk: Buffer) {
        if (input.isActionKey()) {
            this.state.enter();
            return;
        }
        if (input.isExitKey()) {
            this.state.cancel();
            return;
        }
        this.state.addToBuffer(chunk.toString());
    }
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
