import type { Resource } from "./state/Resource";
import { Renderer } from "./render/Renderer";
import { State } from "./state/State";
import { Process } from "./Process";
import { Input } from "./Input";

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

        if (this.state.getMode() === "insert") {
            this.handleInsertMode(input, chunk);
        } else if (this.state.getMode() === "select") {
            this.handleSelectMode(input);
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
        else if (input.isEnterSelectMode()) this.state.enterSelectMode();
        else if (input.isGoTo()) this.state.goTo();
        // else if (input.isSoftQuit()) this.term.quit();
    }
    handleSelectMode(input: Input) {
        if (input.isNext()) this.state.incWord();
        else if (input.isPrev()) this.state.decWord();
        else if (input.isBookMark()) this.state.toggleBookMark();
        else if (input.isSave()) this.state.save();
        else if (input.isLink()) this.state.startLinking();
        else if (input.isSoftQuit()) this.state.enterNavMode();
    }
    handleInsertMode(input: Input, chunk: Buffer) {
        if (input.isExitKey()) {
            this.state.cancel();
            return;
        }
        if (input.isActionKey()) {
            this.state.enter();
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
