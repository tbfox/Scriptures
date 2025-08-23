import { getVerseByReference } from "./src/getVerseByReference";
import { resolveReference } from "./src/referenceResolver";


const help = `-- Scripture Server --
`;

Bun.serve({
    routes: {},
    fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname.split("/").filter((item) => item !== '');
        if (path.length === 0) return new Response(help, { status: 404 });
        
        const { isValid, reference, error } = resolveReference(path);
        if (isValid) {
            console.log(`Resolved reference: ${reference}`);
            return new Response(
                JSON.stringify({
                    reference: reference.split('_').join(' '),
                    verse: getVerseByReference(reference),
                })
            );
        }
        return new Response(`${error}`, { status: 400 });
    },
});

console.log("Server listening...");
