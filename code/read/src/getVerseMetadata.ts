import { readdirSync, statSync } from "fs";
import { join } from "path";

interface VerseMetadata {
    chapters: number;
    verses: number;
}

export function getVerseMetadata(filePath: string): VerseMetadata {
    const pathParts = filePath.split("/").filter((part) => part.length > 0);

    if (pathParts.length < 4) {
        throw new Error(
            `Invalid file path format. Expected: works/[collection]/[book]/[chapter]/[verse].txt, got: ${filePath}`
        );
    }

    const [works, collection, book, chapter] = pathParts;

    if (!works || !collection || !book || !chapter) {
        throw new Error(
            `Invalid file path format. Missing required components in: ${filePath}`
        );
    }

    if (works !== "works") {
        throw new Error(`Expected path to start with 'works', got: ${works}`);
    }

    const worksPath = join(import.meta.dirname, "..", "..", "..", "works");
    const bookPath = join(worksPath, collection, book);
    const chapterPath = join(bookPath, chapter);

    let chaptersCount = 0;
    try {
        const bookContents = readdirSync(bookPath);
        chaptersCount = bookContents.filter((item) => {
            const itemPath = join(bookPath, item);
            const isDirectory = statSync(itemPath).isDirectory();
            const isNumeric = /^\d+$/.test(item);
            return isDirectory && isNumeric;
        }).length;
    } catch (error) {
        throw new Error(
            `Failed to read book directory: ${bookPath}. Error: ${error}`
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
            `Failed to read chapter directory: ${chapterPath}. Error: ${error}`
        );
    }

    return {
        chapters: chaptersCount,
        verses: versesCount,
    };
}

/**
 * Checks if a verse file exists at the given path
 *
 * @param filePath - Path like "works/bom/ether/7/10.txt"
 * @returns true if the file exists, false otherwise
 */
export function verseExists(filePath: string): boolean {
    try {
        const fullPath = join(import.meta.dirname, "..", "..", "..", filePath);
        return statSync(fullPath).isFile();
    } catch {
        return false;
    }
}
