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
    const ref = values.ref;
    if (ref === null || ref === undefined)
        return { ref: parseReference("1 nephi 1:1") };

    return { ref: parseReference(ref) };
}
