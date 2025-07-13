import type { Resource } from "../src/state/Resource";
import type { VerseData } from "./VerseData";

export type NavigatorType = "main" | "dnc" | "std" | "episode";

export interface ResourceNavigator {
    navigatorType: NavigatorType;
    goTo: (res: Resource) => void;
    nextVerse: () => void;
    prevVerse: () => void;
    getState: () => VerseData;
    getCurrent: () => Resource;
}
