import type { AppContext } from "./AppContext";

export abstract class State {
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
    getMode() {}
    clearError() {}
}
