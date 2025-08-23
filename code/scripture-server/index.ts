import { calculateNext } from "./src/calculateNext";
import { getVerseByReference } from "./src/getVerseByReference";
import { resolveReference, validatePath } from "./src/referenceResolver";

Bun.serve({
    routes: {},
    async fetch(req) {
        const path = parsePath(req);

        if (path.length === 0) return helpResponse();

        const { isValid, reference, error } = resolveReference(path);

        if (isValid) {
            try {
                const verse = await getVerseByReference(reference);
                return jsonResponse({
                    ...verse,
                    next: calculateNext(path),
                });
            } catch (e) {
                if (typeof e === "string")
                    return new Response(e, { status: 500 });
            }
        }

        return new Response(error, { status: 400 });
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
    return new Response(JSON.stringify(data));
};

console.log("Server listening...");
