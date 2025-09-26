import { dbManager } from "./database/connection";

const shutdown = (signal: string) => {
    console.log(`\nReceived ${signal}.`);
    console.log('Closing database connection...');
    dbManager.close();
    console.log("Database connection closed. Exiting.");
    process.exit(0);
};

export function setupGracefulShutdown() {
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    if (process.stdin.setRawMode) process.stdin.setRawMode(true);

    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (key: string) => {
        if (key === "q") shutdown("'q'");
        if (key === "Q") shutdown("'Q'");
    });
}
