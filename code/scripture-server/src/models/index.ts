export interface SearchResponse {
    references: string[]
}

export type SearchArgs = {
    contentIncludes: string
    pageSize: number
    pageNumber: number
}

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

export interface BookMetadata {
    name: string;
    url_code: string;
    order: number;
    chapters: number;
    chapter_details: { 
        chapter: number; 
        verses: number;
    }[];
}

export interface SourceMetadata {
    metadata: {
        total_books: number;
        total_chapters: number;
        description: string;
    };
    books: BookMetadata[];
}

export interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}

export interface VerseResponse {
    reference: string;
    text: string;
}
