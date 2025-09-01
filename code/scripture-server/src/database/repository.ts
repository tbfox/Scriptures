import { dbManager } from "./connection";
import { queryCache } from "../utils/cache";
import type { VerseRecord, BookInfo, ChapterInfo } from "../models";

/**
 * Enhanced database repository with caching and common query patterns
 */
export class VerseRepository {
    private static preparedQueries = {
        findVerse: null as any,
        findVersesByChapter: null as any,
        getChapterInfo: null as any,
        getBookInfo: null as any,
    };

    private static getPreparedQuery(
        name: keyof typeof VerseRepository.preparedQueries,
        sql: string,
    ) {
        if (!this.preparedQueries[name]) {
            const db = dbManager.getConnection();
            this.preparedQueries[name] = db.prepare(sql);
        }
        return this.preparedQueries[name];
    }

    /**
     * Find a specific verse with caching
     */
    static findVerse(
        source: string,
        book: string,
        chapter: number,
        verse: number,
    ): VerseRecord | null {
        const cacheKey = "findVerse";
        const params = [source, book, chapter, verse];

        // Check cache first
        const cached = queryCache.get<VerseRecord>(cacheKey, params);
        if (cached) return cached;

        // Query database
        const query = this.getPreparedQuery(
            "findVerse",
            `
            SELECT * FROM verses 
            WHERE source = ? AND book = ? AND chapter = ? AND verse = ?
        `,
        );

        const result = query.get(source, book, chapter, verse) as
            | VerseRecord
            | undefined;

        // Cache result (even if null)
        const resultToCache = result || null;
        queryCache.set(cacheKey, params, resultToCache);

        return resultToCache;
    }

    /**
     * Get all verses for a chapter with caching
     */
    static findVersesByChapter(
        source: string,
        book: string,
        chapter: number,
    ): VerseRecord[] {
        const cacheKey = "findVersesByChapter";
        const params = [source, book, chapter];

        // Check cache first
        const cached = queryCache.get<VerseRecord[]>(cacheKey, params);
        if (cached) return cached;

        // Query database
        const query = this.getPreparedQuery(
            "findVersesByChapter",
            `
            SELECT * FROM verses 
            WHERE source = ? AND book = ? AND chapter = ? 
            ORDER BY verse
        `,
        );

        const result = query.all(source, book, chapter) as VerseRecord[];

        // Cache result
        queryCache.set(cacheKey, params, result);

        return result;
    }

    /**
     * Get chapter info with caching
     */
    static getChapterInfo(
        source: string,
        book: string,
        chapter: number,
    ): ChapterInfo | null {
        const cacheKey = "getChapterInfo";
        const params = [source, book, chapter];

        // Check cache first
        const cached = queryCache.get<ChapterInfo>(cacheKey, params);
        if (cached) return cached;

        // Query database
        const query = this.getPreparedQuery(
            "getChapterInfo",
            `
            SELECT book, chapter, MAX(verse) as maxVerse 
            FROM verses 
            WHERE source = ? AND book = ? AND chapter = ?
            GROUP BY book, chapter
        `,
        );

        const result = query.get(source, book, chapter) as
            | { book: string; chapter: number; maxVerse: number }
            | undefined;

        const chapterInfo = result
            ? {
                  book: result.book,
                  chapter: result.chapter,
                  maxVerse: result.maxVerse,
              }
            : null;

        // Cache result
        queryCache.set(cacheKey, params, chapterInfo, 10 * 60 * 1000); // 10 minutes TTL

        return chapterInfo;
    }

    /**
     * Clear all query caches
     */
    static clearCache(): void {
        queryCache.clear();
    }

    /**
     * Get cache statistics
     */
    static getCacheStats(): { size: number } {
        return { size: queryCache.size() };
    }
}
