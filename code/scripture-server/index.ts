import { getVerseByReference } from "./src/getVerseByReference";
import { resolveReference } from "./src/referenceResolver";

Bun.serve({
    // `routes` requires Bun v1.2.3+
    routes: {
        // Static routes
        // "/api/status": new Response("OK"),
        // // Dynamic routes
        // "/users/:id": req => {
        //   return new Response(`Hello User ${req.params.id}!`);
        // },
        // // Per-HTTP method handlers
        // "/api/posts": {
        //   GET: () => new Response("List posts"),
        //   POST: async req => {
        //     const body = await req.json();
        //     return Response.json({ created: true, ...body });
        //   },
        // },
        // // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
        // "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
        // // Redirect from /blog/hello to /blog/hello/world
        // "/blog/hello": Response.redirect("/blog/hello/world"),
        // // Serve a file by buffering it in memory
        // "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
        //   headers: {
        //     "Content-Type": "image/x-icon",
        //   },
        // }),
    },

    // (optional) fallback for unmatched routes:
    // Required if Bun's version < 1.2.3
    fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        path.shift();
        const { isValid, reference, error } = resolveReference(path);
        if (isValid)
            return new Response(
                JSON.stringify({
                    reference,
                    verse: getVerseByReference(reference),
                })
            );
        else return new Response(error, { status: 400 });
    },
});
console.log("Server listening...");
