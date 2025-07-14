import type { InputAction } from "./InputAction";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
    isUnsaved: boolean;
    showInsertBuffer: boolean;
    buffer: string;
    selectedWord: number | null;
    inputAction: InputAction;
    links: number[];
};
