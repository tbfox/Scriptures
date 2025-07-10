import type { Resource } from "../Resource";

export function parseReference(reference: string): Resource {
    if (!reference.trim())
        throw "Invalid Reference: Reference cannot be empty.";

    // Matches: [number] bookName [chapter[:verse]]
    // Examples: "Matt", "Matt 5", "Matt 5:7", "1 Nephi", "1 Nephi 6", "1 Nephi 6:17"
    const referencePattern =
        /^((?:\d+\s+)?[A-Za-z.& ]+?)(?:\s+(\d+)(?::(\d+))?)?$/;
    const match = reference.trim().match(referencePattern);

    if (!match)
        throw `Invalid Reference: "${reference}" is not a valid format.`;

    const [, bookName, chapterNumber, verseNumber] = match;

    const book = bookName!.trim();
    const chapter = parseNumber(chapterNumber, "chapter") ?? 1;
    const verse = parseNumber(verseNumber, "verse") ?? 1;

    return { book, chapter, verse };
}

function parseNumber(value: string | undefined, type: string): number | null {
    if (!value) return null;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed))
        throw `Invalid Reference: ${type} '${value}' is not a valid number.`;

    return parsed;
}
