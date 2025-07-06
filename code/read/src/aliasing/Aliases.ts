import { readFileSync } from "fs";
import { join } from "path";

interface BookAliasConfig {
    [slug: string]: string[];
}

export class Aliases {
    private aliases = new CachedAliases();
    resolve(bookName: string): string {
        const aliases = this.aliases.get();
        const resolvedSlug = aliases[bookName.trim().toLowerCase()];

        if (resolvedSlug === undefined)
            throw new Error(`Error: '${bookName}' is not a valid book alias.`);

        return resolvedSlug;
    }
}

class CachedAliases {
    private aliases: Record<string, string> | null = null;
    get(): Record<string, string> {
        if (this.aliases !== null) return this.aliases;

        try {
            const configPath = join(
                import.meta.dirname,
                "..",
                "..",
                "..",
                "..",
                "config",
                "bookAliases.config.json"
            );
            const configData = readFileSync(configPath, "utf-8");
            const config: BookAliasConfig = JSON.parse(configData);

            this.aliases = {};
            for (const [slug, aliasArray] of Object.entries(config)) {
                for (const alias of aliasArray) {
                    this.aliases[alias.toLowerCase()] = slug;
                }
            }
        } catch (error) {
            throw new Error(`Failed to load book aliases config: ${error}`);
        }

        return this.aliases;
    }
}
