import type { ReferenceStruct } from "./ReferenceStruct";
import type { VerseData } from "./VerseData";
export type NavigatorType = "main" | "dnc" | "std";
export interface ResourceNavigator {
    navigatorType: NavigatorType;
    goTo: (ref: ReferenceStruct) => void;
    nextVerse: () => void;
    prevVerse: () => void;
    getState: () => VerseData;
}
