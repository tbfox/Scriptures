import { calculateNext, calculatePrev } from "./src/calculateNext";
import { getVerseByReference } from "./src/getVerseByReference";
import { resolveReference, validatePath } from "./src/referenceResolver";
import {
    ValidationError,
    NotFoundError,
    DatabaseError,
    getErrorStatusCode,
} from "./src/errors";

Bun.serve({
    routes: {},
    async fetch(req) {
        const path = parsePath(req);

        if (path.length === 0) return helpResponse();

        const { isValid, reference, error } = resolveReference(path);

        if (isValid) {
            try {
                const [source] = validatePath(path);
                const verse = await getVerseByReference(reference, source);
                return jsonResponse({
                    ...verse,
                    prev: calculatePrev(path),
                    next: calculateNext(path),
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
    },
});

const parsePath = (req: Request) => {
    const url = new URL(req.url);
    return url.pathname.split("/").filter((item) => item !== "");
};

const help = `-- Scripture Server --
`;
const helpResponse = () => new Response(help, { status: 404 });

const jsonResponse = (data: any) => {
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
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

console.log("Server listening...");
