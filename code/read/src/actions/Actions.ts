import type { ModeType } from "../../types/ModeType";
import type { AppContext } from "../state/AppContext";

export abstract class Actions {
    constructor(public context: AppContext) {}
    onEnterMode(prevMode: ModeType) {}
    onExitMode(prevMode: ModeType) {}
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
