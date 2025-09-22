import { fetch } from "./src/fetch.ts";
import { parseArgs } from "util";
import { help } from "./docs/help.ts";
import { search } from "./src/routes/search.ts";
import { health } from "./src/routes/health.ts";
import { setupGracefulShutdown } from "./src/handleShutdown.ts";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        port: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

const PORT = values.port || 3000;

Bun.serve({
    port: PORT,
    routes: {
        "/": () => new Response(help),
        "/health": health,
        "/search": search,
    },
    fetch,
});

console.log(`Server listening on PORT: ${PORT}`);

setupGracefulShutdown();
