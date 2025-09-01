import { ValidationError } from "./errors";
import {
    dbManager,
    getBooksForSource,
    getMaxVerseForChapter,
    verseExists,
} from "./database";

// Map sources to their first book (for source-only requests)
const sourceToFirstBook: Map<string, string> = new Map([
    ["bofm", "1-ne"],
    ["nt", "mat"],
    ["ot", "gen"],
    ["dc", "dc"],
    ["pgp", "moses"],
]);

// Book order mapping for each source
const bookOrders: Map<string, string[]> = new Map([
    [
        "bofm",
        [
            "1 Nephi",
            "2 Nephi",
            "Jacob",
            "Enos",
            "Jarom",
            "Omni",
            "Words of Mormon",
            "Mosiah",
            "Alma",
            "Helaman",
            "3 Nephi",
            "4 Nephi",
            "Mormon",
            "Ether",
            "Moroni",
        ],
    ],
    [
        "nt",
        [
            "Matthew",
            "Mark",
            "Luke",
            "John",
            "Acts",
            "Romans",
            "1 Corinthians",
            "2 Corinthians",
            "Galatians",
            "Ephesians",
            "Philippians",
            "Colossians",
            "1 Thessalonians",
            "2 Thessalonians",
            "1 Timothy",
            "2 Timothy",
            "Titus",
            "Philemon",
            "Hebrews",
            "James",
            "1 Peter",
            "2 Peter",
            "1 John",
            "2 John",
            "3 John",
            "Jude",
            "Revelation",
        ],
    ],
    [
        "ot",
        [
            "Genesis",
            "Exodus",
            "Leviticus",
            "Numbers",
            "Deuteronomy",
            "Joshua",
            "Judges",
            "Ruth",
            "1 Samuel",
            "2 Samuel",
            "1 Kings",
            "2 Kings",
            "1 Chronicles",
            "2 Chronicles",
            "Ezra",
            "Nehemiah",
            "Esther",
            "Job",
            "Psalms",
            "Proverbs",
            "Ecclesiastes",
            "Solomon's Song",
            "Isaiah",
            "Jeremiah",
            "Lamentations",
            "Ezekiel",
            "Daniel",
            "Hosea",
            "Joel",
            "Amos",
            "Obadiah",
            "Jonah",
            "Micah",
            "Nahum",
            "Habakkuk",
            "Zephaniah",
            "Haggai",
            "Zechariah",
            "Malachi",
        ],
    ],
    ["dc", ["D&C"]],
    [
        "pgp",
        [
            "Moses",
            "Abraham",
            "Joseph Smith—Matthew",
            "Joseph Smith—History",
            "Articles of Faith",
        ],
    ],
]);

// URL-friendly book codes to full book names mapping
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

// Reverse mapping for URL generation
const bookNameToCode: Map<string, string> = new Map();
for (const [code, name] of bookCodeToName.entries()) {
    if (!bookNameToCode.has(name)) {
        bookNameToCode.set(name, code);
    }
}

class Reference {
    private source: string;
    private book: string;
    private chapter: number;
    private verse: number;

    constructor(path: string[]) {
        this.source = path[0] || "bofm";

        // Handle source-only requests (1-element paths)
        let bookCode: string;
        if (path.length >= 2) {
            bookCode = path[1]!;
        } else {
            // Default to first book of the source
            bookCode = sourceToFirstBook.get(this.source) || "1-ne";
        }

        this.book = bookCodeToName.get(bookCode) || "1 Nephi";
        // Default to chapter 1 if not provided (handles 1 and 2-element paths)
        this.chapter = parseInt(path[2] || "1");
        // Default to verse 1 if not provided (handles 1, 2 and 3-element paths)
        this.verse = parseInt(path[3] || "1");
    }

    private getBookIndex(): number {
        const bookOrder = bookOrders.get(this.source);
        if (!bookOrder) {
            throw new ValidationError(
                `No book order found for source: ${this.source}`,
            );
        }
        return bookOrder.indexOf(this.book);
    }

    private incBook(): void {
        const bookOrder = bookOrders.get(this.source);
        if (!bookOrder) {
            throw new ValidationError(
                `No book order found for source: ${this.source}`,
            );
        }

        const currentIndex = this.getBookIndex();
        if (currentIndex === -1) {
            throw new ValidationError(`Invalid book: ${this.book}`);
        }

        if (currentIndex >= bookOrder.length - 1) {
            // We're at the last book
            this.book = "END";
        } else {
            this.book = bookOrder[currentIndex + 1]!;
        }
    }

    private decBook(): void {
        const bookOrder = bookOrders.get(this.source);
        if (!bookOrder) {
            throw new ValidationError(
                `No book order found for source: ${this.source}`,
            );
        }

        const currentIndex = this.getBookIndex();
        if (currentIndex === -1) {
            throw new ValidationError(`Invalid book: ${this.book}`);
        }

        if (currentIndex <= 0) {
            // We're at the first book
            this.book = "START";
        } else {
            this.book = bookOrder[currentIndex - 1]!;
        }
    }

    private getMaxChapter(): number {
        const db = dbManager.getConnection();
        const query = db.prepare(`
            SELECT MAX(chapter) as maxChapter 
            FROM verses 
            WHERE source = ? AND book = ?
        `);
        const result = query.get(this.source, this.book) as
            | { maxChapter: number }
            | undefined;
        return result?.maxChapter || 1;
    }

    private incChapter(): void {
        this.chapter++;
        const maxChapter = this.getMaxChapter();

        if (this.chapter > maxChapter) {
            this.chapter = 1;
            this.incBook();
        }
    }

    private decChapter(): void {
        this.chapter--;

        if (this.chapter === 0) {
            this.decBook();
            if (this.book === "START") return;

            // Set to the last chapter of the previous book
            const maxChapter = this.getMaxChapter();
            this.chapter = maxChapter;
        }
    }

    incVerse(): void {
        this.verse++;
        const maxVerse = getMaxVerseForChapter(
            this.source,
            this.book,
            this.chapter,
        );

        if (this.verse > maxVerse) {
            this.verse = 1;
            this.incChapter();
        }
    }

    decVerse(): void {
        this.verse--;

        if (this.verse === 0) {
            this.decChapter();
            if (this.book === "START") return;

            // Set to the last verse of the previous chapter
            const maxVerse = getMaxVerseForChapter(
                this.source,
                this.book,
                this.chapter,
            );
            this.verse = maxVerse;
        }
    }

    getPath(): string {
        if (this.book === "END") return "END";
        if (this.book === "START") return "START";

        const bookCode = bookNameToCode.get(this.book);
        if (!bookCode) {
            throw new ValidationError(
                `No URL code found for book: ${this.book}`,
            );
        }

        return `/${this.source}/${bookCode}/${this.chapter}/${this.verse}`;
    }
}

export function calculatePrev(path: string[]): string {
    const ref = new Reference(path);
    ref.decVerse();
    return ref.getPath();
}

export function calculateNext(path: string[]): string {
    const ref = new Reference(path);
    ref.incVerse();
    return ref.getPath();
}
