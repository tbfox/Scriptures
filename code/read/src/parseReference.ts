type ReferenceStruct = { book: string; chapter: number; verse: number };

export function parseReference(reference: string): ReferenceStruct {
    const regex = /^(?:(\d+)\s+)?([A-Za-z.& ]+)\s+(\d+):(\d+)$/;
    const match = reference.trim().match(regex);

    if (!match) {
        throw `Invalid Reference: '${reference}" is an invalid format.`;
    }
    const [, leadingNumber, bookNameRaw, chapterStr, verseStr] = match;
    if (bookNameRaw === undefined) throw "Invalid Reference: book is undefined";
    if (chapterStr === undefined)
        throw "Invalid Reference: Chapter is undefined";
    if (verseStr === undefined) throw "Invalid Reference: Verse is undefined";

    let book: string;
    if (leadingNumber) {
        book = `${leadingNumber} ${bookNameRaw.trim()}`;
    } else {
        book = bookNameRaw.trim();
    }

    const chapter = parseInt(chapterStr, 10);
    const verse = parseInt(verseStr, 10);

    if (isNaN(chapter)) {
        throw `Invalid Reference: Chapter '${reference}' is not a valid number.`;
    }
    if (isNaN(verse)) {
        throw `Invalid Reference: Chapter '${reference}' is not a valid number.`;
    }

    return {
        book: book,
        chapter: chapter,
        verse: verse,
    };
}
