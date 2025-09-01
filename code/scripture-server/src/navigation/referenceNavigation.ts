import { ValidationError } from "../utils/errors";
import { getMaxVerseForChapter, getBooksForSource } from "../database/helpers";
import {
    getBookOrder,
    getBookCodeToNameMapping,
    getBookNameToCodeMapping,
    getSourceToFirstBookMapping,
} from "../services/metadataService";

// Load mappings from metadata files
const sourceToFirstBook = getSourceToFirstBookMapping();
const bookCodeToName = getBookCodeToNameMapping();
const bookNameToCode = getBookNameToCodeMapping();

class Reference {
    public source: string;
    public book: string;
    public chapter: number;
    public verse: number;

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
        const bookOrder = getBookOrder(this.source);
        return bookOrder.indexOf(this.book);
    }

    public incBook(): void {
        const bookOrder = getBookOrder(this.source);

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

    public decBook(): void {
        const bookOrder = getBookOrder(this.source);

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
        // Use the existing optimized function which should now benefit from caching
        const booksInfo = getBooksForSource(this.source);
        const bookInfo = booksInfo.find((b) => b.book === this.book);
        return bookInfo?.maxChapter || 1;
    }

    public incChapter(): void {
        this.chapter++;
        const maxChapter = this.getMaxChapter();

        if (this.chapter > maxChapter) {
            this.chapter = 1;
            this.incBook();
        }
    }

    public decChapter(): void {
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

export function calculateNextChapter(path: string[]): string {
    const ref = new Reference(path);
    const originalVerse = ref.verse;
    ref.incChapter();

    // If we've reached END, return as is
    if (ref.getPath() === "END") {
        return ref.getPath();
    }

    // Get max verse for the new chapter
    const maxVerse = getMaxVerseForChapter(ref.source, ref.book, ref.chapter);

    // Use the original verse or the last verse of the chapter, whichever is smaller
    ref.verse = Math.min(originalVerse, maxVerse);

    return ref.getPath();
}

export function calculatePrevChapter(path: string[]): string {
    const ref = new Reference(path);
    const originalVerse = ref.verse;
    ref.decChapter();

    // If we've reached START, return as is
    if (ref.getPath() === "START") {
        return ref.getPath();
    }

    // Get max verse for the new chapter
    const maxVerse = getMaxVerseForChapter(ref.source, ref.book, ref.chapter);

    // Use the original verse or the last verse of the chapter, whichever is smaller
    ref.verse = Math.min(originalVerse, maxVerse);

    return ref.getPath();
}

export function calculateChapterEnd(path: string[]): string {
    const ref = new Reference(path);

    // Get max verse for the current chapter
    const maxVerse = getMaxVerseForChapter(ref.source, ref.book, ref.chapter);

    // Set verse to the last verse of the chapter
    ref.verse = maxVerse;

    return ref.getPath();
}

export function calculateChapterStart(path: string[]): string {
    const ref = new Reference(path);

    // Set verse to the first verse of the chapter
    ref.verse = 1;

    return ref.getPath();
}

export function calculateNextBook(path: string[]): string {
    const ref = new Reference(path);
    ref.incBook();

    // If we've reached END, return as is
    if (ref.getPath() === "END") {
        return ref.getPath();
    }

    // Reset to chapter 1, verse 1 when navigating by book
    ref.chapter = 1;
    ref.verse = 1;

    return ref.getPath();
}

export function calculatePrevBook(path: string[]): string {
    const ref = new Reference(path);
    ref.decBook();

    // If we've reached START, return as is
    if (ref.getPath() === "START") {
        return ref.getPath();
    }

    // Reset to chapter 1, verse 1 when navigating by book
    ref.chapter = 1;
    ref.verse = 1;

    return ref.getPath();
}
