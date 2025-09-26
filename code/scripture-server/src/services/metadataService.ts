import { readFileSync } from "fs";
import { join } from "path";

export interface BookMetadata {
    name: string;
    url_code: string;
    order: number;
    chapters: number;
    chapter_details: { chapter: number; verses: number }[];
}

export interface SourceMetadata {
    metadata: {
        total_books: number;
        total_chapters: number;
        description: string;
    };
    books: BookMetadata[];
}

// Cache for loaded metadata
const metadataCache = new Map<string, SourceMetadata>();

// Load metadata for a specific source
function loadSourceMetadata(source: string): SourceMetadata {
    if (metadataCache.has(source)) {
        return metadataCache.get(source)!;
    }

    if (!Bun.env.DATABASE) throw Error("Failed to find DATABASE env variable")
    const metadataPath = join(Bun.env.DATABASE, `${source}_metadata.json`);
    try {
        const rawData = readFileSync(metadataPath, "utf-8");
        const metadata: SourceMetadata = JSON.parse(rawData);
        metadataCache.set(source, metadata);
        return metadata;
    } catch (error) {
        throw new Error(
            `Failed to load metadata for source '${source}': ${error}`,
        );
    }
}

// Normalize book names from metadata format to database format
function normalizeBookName(metadataName: string): string {
    return metadataName.replace(/_/g, " ");
}

// Get URL code for a book name from metadata files
function getUrlCodeForBook(bookName: string): string {
    const sources = ["bofm", "nt", "ot", "dc", "pgp"];

    for (const source of sources) {
        try {
            const metadata = loadSourceMetadata(source);
            for (const book of metadata.books) {
                const dbName = normalizeBookName(book.name);
                if (dbName === bookName) {
                    return book.url_code;
                }
            }
        } catch (error) {
            // Skip sources that don't have metadata files
            continue;
        }
    }

    // Fallback to auto-generated URL code if not found in metadata
    return bookName.toLowerCase().replace(/\s+/g, "-");
}

// Get book order for a source
export function getBookOrder(source: string): string[] {
    const metadata = loadSourceMetadata(source);
    return metadata.books
        .sort((a, b) => a.order - b.order)
        .map((book) => normalizeBookName(book.name));
}

// Get URL-friendly book codes to database book names mapping
export function getBookCodeToNameMapping(): Map<string, string> {
    const sources = ["bofm", "nt", "ot", "dc", "pgp"];
    const mapping = new Map<string, string>();

    for (const source of sources) {
        try {
            const metadata = loadSourceMetadata(source);
            for (const book of metadata.books) {
                const dbName = normalizeBookName(book.name);
                const urlCode = book.url_code;
                mapping.set(urlCode, dbName);

                // Add common aliases
                if (book.name === "Words_of_Mormon") {
                    mapping.set("wom", dbName);
                }
                if (book.name === "Mormon") {
                    mapping.set("morm", dbName);
                }
                if (book.name === "Moroni") {
                    mapping.set("moroni", dbName);
                }
            }
        } catch (error) {
            // Skip sources that don't have metadata files
            continue;
        }
    }

    return mapping;
}

// Get database book names to URL codes mapping
export function getBookNameToCodeMapping(): Map<string, string> {
    const sources = ["bofm", "nt", "ot", "dc", "pgp"];
    const mapping = new Map<string, string>();

    for (const source of sources) {
        try {
            const metadata = loadSourceMetadata(source);
            for (const book of metadata.books) {
                const dbName = normalizeBookName(book.name);
                const urlCode = book.url_code;
                // Only store the first (primary) mapping to avoid duplicates
                if (!mapping.has(dbName)) {
                    mapping.set(dbName, urlCode);
                }
            }
        } catch (error) {
            // Skip sources that don't have metadata files
            continue;
        }
    }

    return mapping;
}

// Get first book for each source
export function getSourceToFirstBookMapping(): Map<string, string> {
    const sources = ["bofm", "nt", "ot", "dc", "pgp"];
    const mapping = new Map<string, string>();

    for (const source of sources) {
        try {
            const metadata = loadSourceMetadata(source);
            const firstBook = metadata.books.find((book) => book.order === 1);
            if (firstBook) {
                mapping.set(source, firstBook.url_code);
            }
        } catch (error) {
            // Skip sources that don't have metadata files
            continue;
        }
    }

    return mapping;
}

// Get all available sources with metadata
export function getAvailableSourcesWithMetadata(): string[] {
    const sources = ["bofm", "nt", "ot", "dc", "pgp"];
    const availableSources: string[] = [];

    for (const source of sources) {
        try {
            loadSourceMetadata(source);
            availableSources.push(source);
        } catch (error) {
            // Skip sources that don't have metadata files
            continue;
        }
    }

    return availableSources;
}
