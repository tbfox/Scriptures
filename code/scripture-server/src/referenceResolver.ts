import { ValidationError } from "./errors";
import {
    getAvailableSources,
    getBooksForSource,
    verseExists,
} from "./database";
import {
    getBookCodeToNameMapping,
    getSourceToFirstBookMapping,
} from "./metadata";

interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}

// Handle source aliases (e.g., 'dnc' -> 'dc')
const sourceAliases: Map<string, string> = new Map([
    ["dnc", "dc"],
    ["dc-testament", "dc"],
]);

// Load mappings from metadata files
const sourceToFirstBook = getSourceToFirstBookMapping();
const bookCodeToName = getBookCodeToNameMapping();

export function validatePath(path: string[]): [string, string, string, string] {
    if (path.length < 1) throw new ValidationError("Source name is required.");
    if (path.length > 4)
        throw new ValidationError(
            "Too many path segments. Expected format: /source[/book[/chapter[/verse]]]",
        );

    // Check for empty string segments
    for (let i = 0; i < path.length; i++) {
        if (path[i] === "") {
            throw new ValidationError("Empty path segments are not allowed.");
        }
    }

    // Validate and normalize source
    let source = path[0]!.toLowerCase();
    if (sourceAliases.has(source)) {
        source = sourceAliases.get(source)!;
    }

    const availableSources = getAvailableSources();
    if (!availableSources.includes(source)) {
        throw new ValidationError(`Source '${source}' is not available.`);
    }

    // Handle book code (path[1]) - default to first book of source if not provided
    let bookCode: string;
    if (path.length >= 2) {
        bookCode = path[1]!.toLowerCase();
    } else {
        // Default to first book of the source
        const firstBook = sourceToFirstBook.get(source);
        if (!firstBook) {
            throw new ValidationError(
                `No default book found for source '${path[0]}'.`,
            );
        }
        bookCode = firstBook;
    }

    // Validate book code
    const bookName = bookCodeToName.get(bookCode);
    if (!bookName) {
        throw new ValidationError(`Book code '${bookCode}' is not recognized.`);
    }

    // Verify the book exists in this source
    const booksInSource = getBooksForSource(source);
    const bookNames = booksInSource.map((bookInfo) => bookInfo.book);
    if (!bookNames.includes(bookName)) {
        throw new ValidationError(
            `Book '${bookName}' is not available in source '${source}'.`,
        );
    }

    // Default to chapter 1 if not provided (handles 1 and 2-element paths)
    const chapter = path[2] || "1";

    // Default to verse 1 if not provided (handles 1, 2 and 3-element paths)
    const verse = path[3] || "1";

    // Validate chapter and verse are numbers
    if (isNaN(parseInt(chapter)) || parseInt(chapter) < 1) {
        throw new ValidationError(`Invalid chapter: ${chapter}`);
    }
    if (isNaN(parseInt(verse)) || parseInt(verse) < 1) {
        throw new ValidationError(`Invalid verse: ${verse}`);
    }

    // Check if the specific verse exists
    const chapterNum = parseInt(chapter);
    const verseNum = parseInt(verse);

    if (!verseExists(source, bookName, chapterNum, verseNum)) {
        throw new ValidationError(
            `${bookName} ${chapterNum}:${verseNum} does not exist.`,
        );
    }

    return [source, bookName, chapter, verse];
}

export function resolveReference(path: string[]): Reference {
    try {
        const [source, book, chapter, verse] = validatePath(path);
        return {
            reference: `${book} ${chapter}:${verse}`,
            isValid: true,
        };
    } catch (error) {
        return {
            reference: "",
            isValid: false,
            error:
                error instanceof ValidationError
                    ? error.message
                    : "Unknown validation error",
        };
    }
}
