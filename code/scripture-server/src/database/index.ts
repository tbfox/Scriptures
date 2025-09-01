/**
 * Database layer exports
 */

export { dbManager } from "./connection";
export { VerseRepository } from "./repository";
export {
    getAvailableSources,
    getBooksForSource,
    getMaxVerseForChapter,
    verseExists,
} from "./helpers";

// Re-export types for convenience
export type { VerseRecord, BookInfo, ChapterInfo } from "../models";
