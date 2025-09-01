import { ValidationError } from "./errors";
import {
    dbManager,
    getBooksForSource,
    getMaxVerseForChapter,
    verseExists,
} from "./database";

// Book order mapping for Book of Mormon
const bofmBookOrder = [
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
];

// URL-friendly book codes to full book names mapping
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
        const bookCode = path[1] || "1-ne";
        this.book = bookCodeToName.get(bookCode) || "1 Nephi";
        this.chapter = parseInt(path[2] || "1");
        // Default to verse 1 if not provided (handles 3-element paths)
        this.verse = parseInt(path[3] || "1");
    }

    private getBookIndex(): number {
        return bofmBookOrder.indexOf(this.book);
    }

    private incBook(): void {
        const currentIndex = this.getBookIndex();
        if (currentIndex === -1) {
            throw new ValidationError(`Invalid book: ${this.book}`);
        }

        if (currentIndex >= bofmBookOrder.length - 1) {
            // We're at the last book
            this.book = "END";
        } else {
            this.book = bofmBookOrder[currentIndex + 1]!;
        }
    }

    private decBook(): void {
        const currentIndex = this.getBookIndex();
        if (currentIndex === -1) {
            throw new ValidationError(`Invalid book: ${this.book}`);
        }

        if (currentIndex <= 0) {
            // We're at the first book
            this.book = "START";
        } else {
            this.book = bofmBookOrder[currentIndex - 1]!;
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
