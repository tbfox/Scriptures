import { Database } from "bun:sqlite";
import { DatabaseError } from "./errors";

/**
 * Centralized database connection manager with improved lifecycle management
 */
class DatabaseManager {
    private static instance: DatabaseManager;
    private db!: Database; // Using definite assignment assertion since connect() initializes it
    private isConnected: boolean = false;

    private constructor() {
        this.connect();
    }

    private connect(): void {
        const dbPath = import.meta.dir + "/../res/standard-works.sqlite";
        try {
            this.db = new Database(dbPath, { readonly: true });
            this.isConnected = true;

            // Only set read-only optimizations that don't require write access
            try {
                this.db.exec("PRAGMA cache_size = 1000;");
                this.db.exec("PRAGMA temp_store = memory;");
            } catch (pragmaError) {
                // Silently ignore PRAGMA errors for readonly databases
                console.warn(
                    "Some PRAGMA optimizations could not be applied to readonly database",
                );
            }
        } catch (error) {
            this.isConnected = false;
            throw new DatabaseError(
                `Failed to connect to database: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public getConnection(): Database {
        if (!this.isConnected) {
            throw new DatabaseError("Database connection is not available");
        }
        return this.db;
    }

    public isHealthy(): boolean {
        try {
            if (!this.isConnected) return false;
            // Simple health check query
            const result = this.db.prepare("SELECT 1 as test").get() as
                | { test: number }
                | undefined;
            return result?.test === 1;
        } catch {
            return false;
        }
    }

    public close(): void {
        if (this.isConnected && this.db) {
            this.db.close();
            this.isConnected = false;
        }
    }

    public reconnect(): void {
        this.close();
        this.connect();
    }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();

/**
 * Database query helpers
 */
export interface VerseRecord {
    id: number;
    source: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
}

export interface BookInfo {
    book: string;
    maxChapter: number;
}

export interface ChapterInfo {
    book: string;
    chapter: number;
    maxVerse: number;
}

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

/**
 * Query result cache for frequently accessed data
 */
class QueryCache {
    private cache = new Map<
        string,
        { data: any; timestamp: number; ttl: number }
    >();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    private generateKey(query: string, params: any[]): string {
        return `${query}:${JSON.stringify(params)}`;
    }

    get<T>(query: string, params: any[], ttl?: number): T | null {
        const key = this.generateKey(query, params);
        const cached = this.cache.get(key);

        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    set(query: string, params: any[], data: any, ttl?: number): void {
        const key = this.generateKey(query, params);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL,
        });
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

const queryCache = new QueryCache();

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
