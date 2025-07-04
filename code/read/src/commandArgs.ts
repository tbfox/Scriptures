import { parseArgs } from "util";
import { parseReference } from "./parseReference";

export function commandArgs() {
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
    if (values.ref === null) return { ref: parseReference("1ne 1:1") };
    return { ref: parseReference(values.ref || "") };
}
