import type { ModeType } from "../../types/ModeType";
import type { AppContext } from "../state/AppContext";

export abstract class Actions {
    constructor(public context: AppContext) {}
    getState() {}
    enter() {}
    cancel() {}
    startLinking() {}
    addToBuffer(key: string) {}
    toggleBookMark() {}
    enterInsertMode() {}
    enterSelectMode() {}
    enterNavMode() {}
    save() {}
    inc() {}
    dec() {}
    goTo() {}
    incWord() {}
    decWord() {}
    getMode = (): ModeType => null;
    clearError() {}
}
