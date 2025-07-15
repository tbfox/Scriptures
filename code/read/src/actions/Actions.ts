import type { AppContext } from "../state/AppContext";

export abstract class Actions {
    constructor(public context: AppContext) {}
    getState() {}
    enter() {}
    cancel() {}
    startLinking() {}
    addToBuffer(key: string) {}
    toggleBookMark() {}
    enterWordMode() {}
    enterNavMode() {}
    save() {}
    inc() {}
    dec() {}
    goTo() {}
    clearError() {}
}
