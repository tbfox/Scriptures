import { App } from "./src/App";
import { Aliases } from "./src/Aliases";
import { commandArgs } from "./src/commandArgs";

function main() {
    if (!process.stdin.isTTY) {
        console.error("This program requires an interactive terminal (TTY).");
        process.exit(1);
    }

    const aliases = new Aliases();
    const { ref } = commandArgs();

    ref.book = aliases.resolve(ref.book);

    const app = new App(ref);

    process.stdin.on("data", app.stdInDataHandler());
    process.stdout.on("resize", app.resizeHandler());
}

main();
