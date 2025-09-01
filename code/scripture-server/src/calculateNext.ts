import { ValidationError } from "./errors";
import {
    VerseRepository,
    getMaxVerseForChapter,
    getBooksForSource,
} from "./database";
import {
    getBookOrder,
    getBookCodeToNameMapping,
    getBookNameToCodeMapping,
    getSourceToFirstBookMapping,
} from "./metadata";

// Load mappings from metadata files
const sourceToFirstBook = getSourceToFirstBookMapping();
const bookCodeToName = getBookCodeToNameMapping();
const bookNameToCode = getBookNameToCodeMapping();

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
        const bookOrder = getBookOrder(this.source);
        return bookOrder.indexOf(this.book);
    }

    private incBook(): void {
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

    private decBook(): void {
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
