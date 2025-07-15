import { parseArgs } from "util";
import { Resource } from "./state/Resource";

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
    const res = values.ref;
    if (res === null || res === undefined)
        return { ref: Resource.parse("1 nephi 1:1") };

    return { ref: Resource.parse(res) };
}
