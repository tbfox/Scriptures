import { parseArgs } from "util";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        port: {
            type: "string",
            short: 'p',
        },
        health: {
            type: "boolean",
        },
    },
    strict: true,
    allowPositionals: true,
});

const URL = `localhost:${values.port || 3000}`

if (values.health) {
    const res = await fetch(`${URL}/health`)
    console.log(await res.json())
}

