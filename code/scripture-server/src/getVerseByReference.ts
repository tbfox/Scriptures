import { ValidationError, NotFoundError, DatabaseError } from "./errors";
import { dbManager, type VerseRecord } from "./database";

export const getVerseByReference = async (ref: string, source: string) => {
    try {
        // Parse the reference (e.g., "1_Nephi 1:1" or "1 Nephi 1:1")
        const normalizedRef = ref.replace(/_/g, " ");
        const parts = normalizedRef.split(" ");

        if (parts.length < 2) {
            throw new ValidationError(`Invalid reference format: '${ref}'`);
        }

        const chapterVerse = parts[parts.length - 1]?.split(":");
        if (!chapterVerse || chapterVerse.length !== 2) {
            throw new ValidationError(
                `Invalid chapter:verse format in reference: '${ref}'`,
            );
        }

        const book = parts.slice(0, -1).join(" ");
        const chapter = parseInt(chapterVerse[0] || "0");
        const verse = parseInt(chapterVerse[1] || "0");

        // Query the database
        const db = dbManager.getConnection();
        const query = db.prepare(`
            SELECT * FROM verses 
            WHERE source = ? AND book = ? AND chapter = ? AND verse = ?
        `);

        const result = query.get(source, book, chapter, verse) as
            | VerseRecord
            | undefined;

        if (!result) {
            throw new NotFoundError(
                `Verse for reference '${ref}' does not exist.`,
            );
        }

        // Format the response to match the expected format
        const reference = `${result.book} ${result.chapter}:${result.verse}`;
        const text = result.content;

        return { reference, text };
    } catch (error) {
        // Re-throw known errors as-is
        if (
            error instanceof ValidationError ||
            error instanceof NotFoundError
        ) {
            throw error;
        }
        // Wrap unknown errors as DatabaseError
        throw new DatabaseError(
            `Database error while retrieving verse: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
    }
};
