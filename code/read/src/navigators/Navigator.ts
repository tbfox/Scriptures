import type { ReferenceStruct } from "../../types/ReferenceStruct";
import type { VerseData } from "../../types/VerseData";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../types/ResourceNavigator";
import { determineSource } from "../file-queries/determineSource";
import { DncNavigator } from "./DncNavigator";
import { StandardNavigator } from "./StandardNavigator";

export class Navigator implements ResourceNavigator {
    navigatorType: NavigatorType = "main";
    private nav: ResourceNavigator;
    constructor(ref: ReferenceStruct) {
        this.nav = this.chooseNavigator(ref);
    }
    private chooseNavigator(ref: ReferenceStruct): ResourceNavigator {
        const source = determineSource(ref.book);
        if (source === "dnc") {
            return new DncNavigator(ref);
        } else {
            return new StandardNavigator(source, ref);
        }
    }
    goTo(ref: ReferenceStruct) {
        this.nav = this.chooseNavigator(ref);
        // this.nav.goTo(ref);
    }

    nextVerse = () => this.nav.nextVerse();

    prevVerse = () => this.nav.prevVerse();

    getState = (): VerseData => this.nav.getState();
}
