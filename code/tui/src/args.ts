import { parseArgs } from "util";

export const cliArguments = parseArgs({
    args: Bun.argv,
    options: {
        ref: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

export type CliArguments = typeof cliArguments
