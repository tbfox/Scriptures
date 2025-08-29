import { Database } from "bun:sqlite";

type VerseRecord = {
    id: number;
    source: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
};

export const getVerseByReference = async (ref: string) => {
    const db = new Database(import.meta.dir + "/../res/standard-works.sqlite");

    try {
        // Parse the reference (e.g., "1_Nephi 1:1" or "1 Nephi 1:1")
        const normalizedRef = ref.replace(/_/g, " ");
        const parts = normalizedRef.split(" ");

        if (parts.length < 2) {
            throw `Invalid reference format: '${ref}'`;
        }

        const chapterVerse = parts[parts.length - 1]?.split(":");
        if (!chapterVerse || chapterVerse.length !== 2) {
            throw `Invalid chapter:verse format in reference: '${ref}'`;
        }

        const book = parts.slice(0, -1).join(" ");
        const chapter = parseInt(chapterVerse[0] || "0");
        const verse = parseInt(chapterVerse[1] || "0");

        // Query the database
        const query = db.prepare(`
            SELECT * FROM verses 
            WHERE book = ? AND chapter = ? AND verse = ?
        `);

        const result = query.get(book, chapter, verse) as
            | VerseRecord
            | undefined;

        if (!result) {
            throw `Verse for reference '${ref}' does not exist.`;
        }

        // Format the response to match the expected format
        const reference = `${result.book} ${result.chapter}:${result.verse}`;
        const text = result.content;

        return { reference, text };
    } finally {
        db.close();
    }
};
