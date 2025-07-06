import type { VerseData } from "../types/VerseData";

export interface ResourceNavigator {
    nextVerse: () => void;
    prevVerse: () => void;
    getState: () => VerseData;
    getScripture: () => void;
}
