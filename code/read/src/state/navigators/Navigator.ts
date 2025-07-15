import type { VerseData } from "../../../types/VerseData";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../../types/ResourceNavigator";
import { determineSource } from "../../file-queries/determineSource";
import { DncNavigator } from "./DncNavigator";
import { StandardNavigator } from "./StandardNavigator";
import { EpisodeNavigator } from "./EpisodeNavigator";
import type { Resource } from "../Resource";

export class Navigator implements ResourceNavigator {
    navigatorType: NavigatorType = "main";
    private nav: ResourceNavigator;
    constructor(ref: Resource) {
        this.nav = this.chooseNavigator(ref);
    }
    private chooseNavigator(ref: Resource): ResourceNavigator {
        const source = determineSource(ref.source);
        if (source === "dnc") {
            return new DncNavigator(ref);
        } else if (source === "notes") {
            return new EpisodeNavigator(ref);
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
