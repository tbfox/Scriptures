import type { VerseData } from "./VerseData";

export interface ResourceNavigator {
    nextVerse: () => void;
    prevVerse: () => void;
    getState: () => VerseData;
    getScripture: () => void;
}
