import { ValidationError } from "./errors";
import {
    getAvailableSources,
    getBooksForSource,
    verseExists,
} from "./database";

interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}

// Map source aliases to canonical names
const sourceAliases: Map<string, string> = new Map([
    ["dnc", "dc"],
    ["dc-testament", "dc"],
]);

// Map URL-friendly book codes to database book names
const bookCodeToName: Map<string, string> = new Map([
    ["1-ne", "1 Nephi"],
    ["2-ne", "2 Nephi"],
    ["jacob", "Jacob"],
    ["enos", "Enos"],
    ["jarom", "Jarom"],
    ["omni", "Omni"],
    ["w-of-m", "Words of Mormon"],
    ["wom", "Words of Mormon"],
    ["mosiah", "Mosiah"],
    ["alma", "Alma"],
    ["hel", "Helaman"],
    ["3-ne", "3 Nephi"],
    ["4-ne", "4 Nephi"],
    ["morm", "Mormon"],
    ["mormon", "Mormon"],
    ["ether", "Ether"],
    ["moro", "Moroni"],
    ["moroni", "Moroni"],
]);

export function validatePath(path: string[]): [string, string, string, string] {
    if (path.length < 1) throw new ValidationError("Source name is required.");
    if (path.length < 2) throw new ValidationError("Book name is required.");
    if (path.length > 4)
        throw new ValidationError(
            "Too many arguments. Format: /source/book[/chapter[/verse]]",
        );

    // Default to chapter 1 if not provided
    const chapter = path.length >= 3 ? path[2]! : "1";
    // Default to verse 1 if not provided
    const verse = path.length >= 4 ? path[3]! : "1";

    // Normalize source name
    let source = path[0]!;
    source = sourceAliases.get(source) || source;

    // Validate source exists in database
    const availableSources = getAvailableSources();
    if (!availableSources.includes(source)) {
        throw new ValidationError(
            `Source '${path[0]}' is not a valid source. Available sources: ${availableSources.join(", ")}`,
        );
    }

    const bookCode = path[1]!;
    const bookName = bookCodeToName.get(bookCode);

    if (!bookName) {
        throw new ValidationError(`Book code '${bookCode}' is not recognized.`);
    }

    // Validate book exists in the specified source
    const booksForSource = getBooksForSource(source);
    const bookExists = booksForSource.some((b) => b.book === bookName);

    if (!bookExists) {
        const availableBooks = booksForSource.map((b) => b.book).join(", ");
        throw new ValidationError(
            `Book '${bookName}' does not exist in source '${source}'. Available books: ${availableBooks}`,
        );
    }

    // Validate chapter and verse are numbers
    if (!/^\d+$/.test(chapter))
        throw new ValidationError(`Chapter '${chapter}' is not a number.`);

    if (!/^\d+$/.test(verse))
        throw new ValidationError(`Verse '${verse}' is not a number.`);

    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);

    // Validate verse exists in database
    if (!verseExists(source, bookName, chapterNum, verseNum)) {
        throw new ValidationError(
            `Verse ${bookName} ${chapterNum}:${verseNum} does not exist in the database.`,
        );
    }

    return [source, bookCode, chapter, verse];
}

export function resolveReference(path: string[]): Reference {
    try {
        const validatedPath = validatePath(path);
        const [source, bookCode, chapterStr, verseStr] = validatedPath;

        const bookName = bookCodeToName.get(bookCode);
        if (!bookName) {
            throw new ValidationError(
                `Book code '${bookCode}' is not recognized.`,
            );
        }

        const reference = `${bookName} ${chapterStr}:${verseStr}`;

        return {
            reference,
            isValid: true,
        };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        return {
            reference: "",
            isValid: false,
            error: errorMessage,
        };
    }
}
