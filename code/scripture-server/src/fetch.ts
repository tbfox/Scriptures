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
import {
    resolveReference,
    validatePath,
} from "./services/referenceResolver";
import { getErrorStatusCode } from "./utils/errors";
import { getSearchResults } from "./services/searchService";
import { jsonResponse } from "./utils/jsonResponse";
import { dbManager } from "./database/connection";

export async function fetch(req: Request) {
    const { path, searchParams } = parsePath(req);


    if (path.length === 1) {
        if (path[0] === "health") {
            const healthy = isHealthy();
            return jsonResponse({
                status: healthy ? "healthy" : "unhealthy",
                timestamp: new Date().toISOString(),
            });
        }
        if (path[0] === "search") {
            const contentIncludes = searchParams.get("content_includes");
            const pageSize = parseInt(
                searchParams.get("page_size") || "20",
            );
            const pageNumber = parseInt(searchParams.get("page") || "0");

            return jsonResponse(
                await getSearchResults({
                    contentIncludes,
                    pageSize,
                    pageNumber,
                }),
            );
        }
    }

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
            const errorMessage =
                e instanceof Error ? e.message : "Unknown error";
            const statusCode =
                e instanceof Error ? getErrorStatusCode(e) : 500;
            return errorResponse(errorMessage, statusCode);
        }
    }

    return errorResponse(error || "Invalid request", 400);
}
const parsePath = (req: Request) => {
    const url = new URL(req.url);
    return {
        path: url.pathname.split("/").filter((item) => item !== ""),
        searchParams: url.searchParams,
    };
};



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


// Graceful shutdown handling
const shutdown = (signal: string) => {
    console.log(`\nReceived ${signal}. Closing database connection...`);
    dbManager.close();
    console.log("Database connection closed. Exiting.");
    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Health check endpoint
const isHealthy = () => {
    try {
    } catch (error) {
        console.error("Health check failed:", error);
        return false;
    }
};
