import type { Resource } from "../../types/ReferenceStruct";
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
    constructor(ref: Resource) {
        this.nav = this.chooseNavigator(ref);
    }
    private chooseNavigator(ref: Resource): ResourceNavigator {
        const source = determineSource(ref.book);
        if (source === "dnc") {
            return new DncNavigator(ref);
        } else {
            return new StandardNavigator(source, ref);
        }
    }
    goTo(ref: Resource) {
        this.nav = this.chooseNavigator(ref);
    }
    nextVerse = () => this.nav.nextVerse();
    prevVerse = () => this.nav.prevVerse();
    getState = (): VerseData => this.nav.getState();
    getCurrent = (): Resource => this.nav.getCurrent();
}
