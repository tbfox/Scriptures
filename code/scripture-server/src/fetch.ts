import {
    calculateNext,
    calculatePrev,
    calculateNextChapter,
    calculatePrevChapter,
    calculateChapterEnd,
    calculateChapterStart,
    calculateNextBook,
    calculatePrevBook,
} from "./navigation/referenceNavigation";
import { getVerseByReference } from "./services/verseService";
import { resolveReference, validatePath } from "./services/referenceResolver";
import { getErrorStatusCode } from "./utils/errors";
import { jsonResponse } from "./utils/jsonResponse";
import { parsePath } from "./utils/parsePath";

export async function fetch(req: Request) {
    const { path } = parsePath(req);

    const { isValid, reference, error } = resolveReference(path);

    if (isValid) {
        try {
            const [source] = validatePath(path);
            const verse = await getVerseByReference(reference, source);
            return jsonResponse({
                ...verse,
                prev: calculatePrev(path),
                next: calculateNext(path),
                prevChap: calculatePrevChapter(path),
                nextChap: calculateNextChapter(path),
                chapStart: calculateChapterStart(path),
                chapEnd: calculateChapterEnd(path),
                prevBook: calculatePrevBook(path),
                nextBook: calculateNextBook(path),
            });
        } catch (e) {
            if (e instanceof Error) {
                return errorResponse(e.message, getErrorStatusCode(e));
            }
            return errorResponse("Unknown Error", 500);
        }
    }

    return errorResponse(error || "Invalid request", 400);
}

const errorResponse = (message: string, status: number) => {
    return new Response(
        JSON.stringify({
            error: message,
            timestamp: new Date().toISOString(),
        }),
        {
            status,
            headers: { "Content-Type": "application/json" },
        },
    );
};
