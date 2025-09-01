import { dbManager } from "./connection";
import type { BookInfo } from "../models";

/**
 * Database query helpers
 */

/**
 * Get all available sources from the database
 */
export function getAvailableSources(): string[] {
    const db = dbManager.getConnection();
    const query = db.prepare(
        "SELECT DISTINCT source FROM verses ORDER BY source",
    );
    const results = query.all() as { source: string }[];
    return results.map((r) => r.source);
}

/**
 * Get all books for a given source
 */
export function getBooksForSource(source: string): BookInfo[] {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT book, MAX(chapter) as maxChapter 
        FROM verses 
        WHERE source = ? 
        GROUP BY book 
        ORDER BY id
    `);
    const results = query.all(source) as { book: string; maxChapter: number }[];
    return results.map((r) => ({ book: r.book, maxChapter: r.maxChapter }));
}

/**
 * Get max verse count for a specific book and chapter
 */
export function getMaxVerseForChapter(
    source: string,
    book: string,
    chapter: number,
): number {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT MAX(verse) as maxVerse 
        FROM verses 
        WHERE source = ? AND book = ? AND chapter = ?
    `);
    const result = query.get(source, book, chapter) as
        | { maxVerse: number }
        | undefined;
    return result?.maxVerse || 0;
}

/**
 * Check if a verse exists in the database
 */
export function verseExists(
    source: string,
    book: string,
    chapter: number,
    verse: number,
): boolean {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT COUNT(*) as count 
        FROM verses 
        WHERE source = ? AND book = ? AND chapter = ? AND verse = ?
    `);
    const result = query.get(source, book, chapter, verse) as { count: number };
    return result.count > 0;
}
