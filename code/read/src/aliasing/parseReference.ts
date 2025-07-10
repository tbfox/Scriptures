import type { ReferenceStruct } from "../../types/ReferenceStruct";

export function parseReference(reference: string): ReferenceStruct {
    if (reference === "") throw `Invalid Reference: Found empty reference.`;

    // Updated regex to handle partial references: book [chapter[:verse]]
    const regex = /^((?:\d+\s+)?[A-Za-z.& ]+?)(?:\s+(\d+)(?::(\d+))?)?$/;
    const match = reference.trim().match(regex);

    if (!match) {
        throw `Invalid Reference: "${reference}" is an invalid format.`;
    }

    const [, bookNameRaw, chapterStr, verseStr] = match;

    if (bookNameRaw === undefined) throw "Invalid Reference: book is undefined";

    const book = bookNameRaw.trim();
    const chapter = chapterStr ? parseInt(chapterStr, 10) : 1;
    const verse = verseStr ? parseInt(verseStr, 10) : 1;

    if (chapterStr && isNaN(chapter)) {
        throw `Invalid Reference: Chapter '${chapterStr}' is not a valid number.`;
    }
    if (verseStr && isNaN(verse)) {
        throw `Invalid Reference: Verse '${verseStr}' is not a valid number.`;
    }

    return {
        book: book,
        chapter: chapter,
        verse: verse,
    };
}
