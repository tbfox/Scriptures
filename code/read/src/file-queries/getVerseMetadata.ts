import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { resolveWorkspacePath } from "./pathResolver";

interface VerseMetadata {
    chapters: number;
    verses: number;
}

export function getVerseMetadata(filePath: string): VerseMetadata {
    const pathParts = filePath.split("/").filter((part) => part.length > 0);

    if (pathParts.length < 4) {
        throw new Error(
            `Invalid file path format. Expected: works/[work]/[source]/[chapter]/[verse].txt, got: ${filePath}`
        );
    }

    const [works, work, source, chapter] = pathParts;

    if (!works || !work || !source || !chapter) {
        throw new Error(
            `Invalid file path format. Missing required components in: ${filePath}`
        );
    }

    if (works !== "works") {
        throw new Error(`Expected path to start with 'works', got: ${works}`);
    }

    const worksPath = resolveWorkspacePath("works");
    const sourcePath = join(worksPath, work, source);
    const chapterPath = join(sourcePath, chapter);

    let chaptersCount = 0;
    try {
        const bookContents = readdirSync(sourcePath);
        chaptersCount = bookContents.filter((item) => {
            const itemPath = join(sourcePath, item);
            const isDirectory = statSync(itemPath).isDirectory();
            const isNumeric = /^\d+$/.test(item);
            return isDirectory && isNumeric;
        }).length;
    } catch (error) {
        throw new Error(
            `Failed to read book directory: ${sourcePath}. Error: ${error}`
        );
    }

    // Count verses in the current chapter
    let versesCount = 0;
    try {
        const chapterContents = readdirSync(chapterPath);
        versesCount = chapterContents.filter((item) => {
            const isTextFile = item.endsWith(".txt");
            const verseNumber = item.replace(".txt", "");
            const isNumeric = /^\d+$/.test(verseNumber);
            return isTextFile && isNumeric;
        }).length;
    } catch (error) {
        throw new Error(
            `Failed to read chapter directory: ${chapterPath}.\n${error}`
        );
    }

    return {
        chapters: chaptersCount,
        verses: versesCount,
    };
}

export function getDncMetadata(filePath: string): VerseMetadata {
    const pathParts = filePath.split("/").filter((part) => part.length > 0);

    if (pathParts.length < 3) {
        throw new Error(
            `Invalid DNC file path format. Expected: works/dnc/[section]/[verse].txt, got: ${filePath}`
        );
    }

    const [works, work, section] = pathParts;

    if (!works || !work || !section) {
        throw new Error(
            `Invalid DNC file path format. Missing required components in: ${filePath}`
        );
    }

    if (works !== "works") {
        throw new Error(`Expected path to start with 'works', got: ${works}`);
    }

    if (work !== "dnc") {
        throw new Error(`Expected work to be 'dnc', got: ${work}`);
    }

    const worksPath = resolveWorkspacePath("works");
    const dncPath = join(worksPath, "dnc");
    const sectionPath = join(dncPath, section);

    // Count sections (directories with numeric names)
    let sectionsCount = 0;
    try {
        const dncContents = readdirSync(dncPath);
        sectionsCount = dncContents.filter((item) => {
            const itemPath = join(dncPath, item);
            const isDirectory = statSync(itemPath).isDirectory();
            const isNumeric = /^\d+$/.test(item);
            return isDirectory && isNumeric;
        }).length;
    } catch (error) {
        throw new Error(
            `Failed to read dnc directory: ${dncPath}. Error: ${error}`
        );
    }

    // Count verses in the current section
    let versesCount = 0;
    try {
        const sectionContents = readdirSync(sectionPath);
        versesCount = sectionContents.filter((item) => {
            const isTextFile = item.endsWith(".txt");
            const verseNumber = item.replace(".txt", "");
            const isNumeric = /^\d+$/.test(verseNumber);
            return isTextFile && isNumeric;
        }).length;
    } catch (error) {
        throw new Error(
            `Failed to read section directory: ${sectionPath}.\n${error}`
        );
    }

    return {
        chapters: sectionsCount,
        verses: versesCount,
    };
}

export function verseExists(filePath: string): boolean {
    try {
        const fullPath = resolveWorkspacePath(filePath);
        return statSync(fullPath).isFile();
    } catch {
        return false;
    }
}

export function getEpisodeMetadata(filePath: string): { episodes: number } {
    // Extract the series path from the file path
    // e.g., "notes/podcast/foundations/episode_1.txt" -> "notes/podcast/foundations"
    const pathParts = filePath.split("/");
    const seriesPath = pathParts.slice(0, -1).join("/");

    try {
        const metadataPath = resolveWorkspacePath(
            join(seriesPath, ".metadata")
        );
        const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
        return {
            episodes: metadata.order.length,
        };
    } catch (error) {
        // Fallback to default number of episodes
        return {
            episodes: 3,
        };
    }
}
