import { readFileSync } from "fs";
import { resolveWorkspacePath } from "../file-queries/pathResolver";

interface SourceAliasConfig {
    [slug: string]: string[];
}

export class Aliases {
    private aliases = new CachedAliases();
    resolve(source: string): string {
        const aliases = this.aliases.get();
        const resolvedSlug = aliases[source.trim().toLowerCase()];

        if (resolvedSlug === undefined)
            throw new Error(`Error: '${source}' is not a valid source alias.`);

        return resolvedSlug;
    }
}

class CachedAliases {
    private aliases: Record<string, string> | null = null;
    get(): Record<string, string> {
        if (this.aliases !== null) return this.aliases;

        try {
            const configPath = resolveWorkspacePath(
                "config/sourceAliases.config.json"
            );
            const configData = readFileSync(configPath, "utf-8");
            const config: SourceAliasConfig = JSON.parse(configData);

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
