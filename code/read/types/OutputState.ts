import type { CommandType } from "./CommandType";

export type OutputState = {
    verseReference: string;
    verseText: string;
    error: string | null;
    isBookMarked: boolean;
    isUnsaved: boolean;
    showInsertBuffer: boolean;
    buffer: string;
    selectedWord: number | null;
    inputAction: CommandType;
    links: number[];
};
