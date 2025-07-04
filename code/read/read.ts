import { App } from "./src/App";
import { parseArgs } from "util";
import { parseReference } from "./src/parseReference";
import { Aliases } from "./src/Aliases";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        ref: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

function main() {
    if (!process.stdin.isTTY) {
        console.error("This program requires an interactive terminal (TTY).");
        process.exit(1);
    }
    const ref = parseReference(values.ref || "");
    const al = new Aliases();
    ref.book = al.resolve(ref.book);

    const app = new App(ref);

    process.stdin.on("data", app.stdInDataHandler());
    process.stdout.on("resize", app.resizeHandler());
}

main();
