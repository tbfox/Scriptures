import { readFileSync } from "fs";
import { getEpisodeMetadata } from "../file-queries/getVerseMetadata";
import { Resource } from "../state/components/Resource";
import type { VerseData } from "../../types/VerseData";
import type {
    NavigatorType,
    ResourceNavigator,
} from "../../types/ResourceNavigator";
import { MarkdownParser } from "../parsers/MarkdownParser";

export class EpisodeNavigator implements ResourceNavigator {
    navigatorType: NavigatorType = "episode";
    private series: string; // e.g., "foundations"
    private episode: number; // episode number within the series
    private currentPoint: number; // current point within the episode
    private episodeContent: string; // cached episode content

    constructor(ref: Resource) {
        this.series = ref.source; // "podcast" from the reference
        this.episode = ref.chapter; // episode number from chapter
        this.currentPoint = ref.verse; // point number from verse
        this.episodeContent = this.loadEpisodeContent();
    }
    goTo(ref: Resource) {
        this.series = ref.source;
        this.episode = ref.chapter;
        this.currentPoint = ref.verse;
        this.episodeContent = this.loadEpisodeContent();
    }
    nextVerse() {
        this.currentPoint += 1;
        const totalPoints = MarkdownParser.getTotalPoints(this.episodeContent);
        if (this.currentPoint > totalPoints) {
            // Move to next episode
            this.episode += 1;
            const { episodes } = getEpisodeMetadata(this.getPath());
            if (this.episode > episodes) {
                this.episode = 1;
            }
            this.episodeContent = this.loadEpisodeContent();
            this.currentPoint = 1;
        }
    }
    prevVerse() {
        this.currentPoint -= 1;
        if (this.currentPoint === 0) {
            // Move to previous episode
            this.episode -= 1;
            if (this.episode === 0) {
                const { episodes } = getEpisodeMetadata(this.getPath());
                this.episode = episodes;
            }
            this.episodeContent = this.loadEpisodeContent();
            const totalPoints = MarkdownParser.getTotalPoints(
                this.episodeContent
            );
            this.currentPoint = totalPoints;
        }
    }
    getState(): VerseData {
        const point = MarkdownParser.getPointByNumber(
            this.episodeContent,
            this.currentPoint
        );
        const pointText = point ? point.content : "Point not found";
        return {
            work: "notes",
            source: this.series,
            chapter: this.episode,
            verse: this.currentPoint,
            text: pointText,
            ref: Resource.getId(this.getCurrent()),
        };
    }
    getCurrent(): Resource {
        return new Resource(this.series, this.episode, this.currentPoint);
    }
    private getPath() {
        return `notes/podcast/foundations/episode_${this.episode}.md`;
    }
    private loadEpisodeContent(): string {
        return readFileSync(Bun.env.ROOT_DIR + this.getPath(), "utf-8");
    }
}
