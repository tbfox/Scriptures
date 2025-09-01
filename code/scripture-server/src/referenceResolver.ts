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

// Map sources to their first book (for source-only requests)
const sourceToFirstBook: Map<string, string> = new Map([
    ["bofm", "1-ne"],
    ["nt", "mat"],
    ["ot", "gen"],
    ["dc", "dc"],
    ["pgp", "moses"],
]);

// Map URL-friendly book codes to database book names
const bookCodeToName: Map<string, string> = new Map([
    // Book of Mormon
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

    // New Testament
    ["mat", "Matthew"],
    ["mark", "Mark"],
    ["luke", "Luke"],
    ["john", "John"],
    ["acts", "Acts"],
    ["rom", "Romans"],
    ["1-cor", "1 Corinthians"],
    ["2-cor", "2 Corinthians"],
    ["gal", "Galatians"],
    ["eph", "Ephesians"],
    ["phil", "Philippians"],
    ["col", "Colossians"],
    ["1-thes", "1 Thessalonians"],
    ["2-thes", "2 Thessalonians"],
    ["1-tim", "1 Timothy"],
    ["2-tim", "2 Timothy"],
    ["titus", "Titus"],
    ["philem", "Philemon"],
    ["heb", "Hebrews"],
    ["james", "James"],
    ["1-pet", "1 Peter"],
    ["2-pet", "2 Peter"],
    ["1-jn", "1 John"],
    ["2-jn", "2 John"],
    ["3-jn", "3 John"],
    ["jude", "Jude"],
    ["rev", "Revelation"],

    // Old Testament
    ["gen", "Genesis"],
    ["ex", "Exodus"],
    ["lev", "Leviticus"],
    ["num", "Numbers"],
    ["deut", "Deuteronomy"],
    ["josh", "Joshua"],
    ["judg", "Judges"],
    ["ruth", "Ruth"],
    ["1-sam", "1 Samuel"],
    ["2-sam", "2 Samuel"],
    ["1-kgs", "1 Kings"],
    ["2-kgs", "2 Kings"],
    ["1-chr", "1 Chronicles"],
    ["2-chr", "2 Chronicles"],
    ["ezra", "Ezra"],
    ["neh", "Nehemiah"],
    ["esth", "Esther"],
    ["job", "Job"],
    ["ps", "Psalms"],
    ["prov", "Proverbs"],
    ["eccl", "Ecclesiastes"],
    ["song", "Solomon's Song"],
    ["isa", "Isaiah"],
    ["jer", "Jeremiah"],
    ["lam", "Lamentations"],
    ["ezek", "Ezekiel"],
    ["dan", "Daniel"],
    ["hosea", "Hosea"],
    ["joel", "Joel"],
    ["amos", "Amos"],
    ["obad", "Obadiah"],
    ["jonah", "Jonah"],
    ["micah", "Micah"],
    ["nahum", "Nahum"],
    ["hab", "Habakkuk"],
    ["zeph", "Zephaniah"],
    ["hag", "Haggai"],
    ["zech", "Zechariah"],
    ["mal", "Malachi"],

    // Doctrine & Covenants
    ["dc", "D&C"],

    // Pearl of Great Price
    ["moses", "Moses"],
    ["abr", "Abraham"],
    ["js-m", "Joseph Smith—Matthew"],
    ["js-h", "Joseph Smith—History"],
    ["a-of-f", "Articles of Faith"],
]);

export function validatePath(path: string[]): [string, string, string, string] {
    if (path.length < 1) throw new ValidationError("Source name is required.");
    if (path.length > 4)
        throw new ValidationError(
            "Too many arguments. Format: /source[/book[/chapter[/verse]]]",
        );

    // Handle source-only requests by defaulting to first book
    let bookCode: string;
    if (path.length >= 2) {
        bookCode = path[1]!;
    } else {
        // Default to first book of the source
        const source = sourceAliases.get(path[0]!) || path[0]!;
        const firstBook = sourceToFirstBook.get(source);
        if (!firstBook) {
            throw new ValidationError(
                `No default book found for source '${path[0]}'.`,
            );
        }
        bookCode = firstBook;
    }

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
