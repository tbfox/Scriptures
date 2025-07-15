import { App } from "./src/App";
import { commandArgs } from "./src/commandArgs";
import { initializePathResolver } from "./src/file-queries/pathResolver";

function main() {
    // Initialize path resolver to set ROOT_DIR environment variable
    initializePathResolver();
    if (!process.stdin.isTTY) {
        console.error("This program requires an interactive terminal (TTY).");
        process.exit(1);
    }

    const app = new App(commandArgs().ref);

    process.stdin.on("data", app.stdInDataHandler());
    process.stdout.on("resize", app.resizeHandler());
}

main();
