import { join } from "path";
import { appendFileSync } from "fs";

export class Log {
    private static path = join(Bun.env.HOME || "~", ".logs/ss.log");

    static render(func: Function) {
        appendFileSync(this.path, `Rendering: <${func.name} />\n`);
    }
    static info(message: string) {
        appendFileSync(this.path, `Info: ${message}\n`);
    }
    static obj(label: string, obj: object) {
        appendFileSync(this.path, `${label}: ${JSON.stringify(obj)}\n`);
    }
    static error(message: string) {
        appendFileSync(this.path, `Error: ${message}\n`);
    }
}
