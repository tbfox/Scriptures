export interface EpisodePoint {
    pointNumber: number;
    content: string;
}

export class MarkdownParser {
    static parsePoints(markdownContent: string): EpisodePoint[] {
        const points: EpisodePoint[] = [];
        const lines = markdownContent.split("\n");

        let currentPoint: EpisodePoint | null = null;
        let currentContent: string[] = [];

        for (const line of lines) {
            // Check if this is a point header (## POINT X)
            const pointMatch = line.match(/^## POINT (\d+)$/);

            if (pointMatch && pointMatch[1]) {
                // Save previous point if exists
                if (currentPoint) {
                    currentPoint.content = currentContent.join("\n").trim();
                    points.push(currentPoint);
                }

                // Start new point
                currentPoint = {
                    pointNumber: parseInt(pointMatch[1], 10),
                    content: "",
                };
                currentContent = [];
            } else if (currentPoint && line !== "---" && line.trim() !== "") {
                // Add content to current point (skip separators and empty lines)
                currentContent.push(line);
            }
        }

        // Don't forget the last point
        if (currentPoint) {
            currentPoint.content = currentContent.join("\n").trim();
            points.push(currentPoint);
        }

        return points;
    }

    static getPointByNumber(
        markdownContent: string,
        pointNumber: number
    ): EpisodePoint | null {
        const points = this.parsePoints(markdownContent);
        return (
            points.find((point) => point.pointNumber === pointNumber) || null
        );
    }

    static getTotalPoints(markdownContent: string): number {
        return this.parsePoints(markdownContent).length;
    }
}
