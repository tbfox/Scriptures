import { App } from "./src/App";

if (!process.stdin.isTTY) {
    console.error("This program requires an interactive terminal (TTY).");
    process.exit(1);
}

const app = new App();

process.stdin.on("data", app.stdInDataHandler());
process.stdout.on("resize", app.resizeHandler());
