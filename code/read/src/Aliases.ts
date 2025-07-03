import { readFileSync } from "fs";
import { join } from "path";

interface BookAliasConfig {
    [slug: string]: string[];
}

export class Aliases {
    private aliases: Record<string, string> = {};
    private loaded = false;

    private loadConfig(): void {
        if (this.loaded) return;

        try {
            const configPath = join(
                import.meta.dirname,
                "..",
                "..",
                "..",
                "config",
                "bookAliases.config.json"
            );
            const configData = readFileSync(configPath, "utf-8");
            const config: BookAliasConfig = JSON.parse(configData);

            // Build reverse lookup: alias -> slug (case-insensitive)
            this.aliases = {};
            for (const [slug, aliasArray] of Object.entries(config)) {
                for (const alias of aliasArray) {
                    this.aliases[alias.toLowerCase()] = slug;
                }
            }

            this.loaded = true;
        } catch (error) {
            throw new Error(`Failed to load book aliases config: ${error}`);
        }
    }

    /**
     * Resolves a book name or alias to its standardized slug form
     * @param bookName The book name or alias to resolve
     * @returns The standardized slug for the book
     * @throws Error if the book name/alias is not found
     */
    resolve(bookName: string): string {
        this.loadConfig();

        if (!bookName || typeof bookName !== "string") {
            throw new Error("Book name must be a non-empty string");
        }

        const normalizedBookName = bookName.trim().toLowerCase();
        const resolvedSlug = this.aliases[normalizedBookName];

        if (!resolvedSlug) {
            throw new Error(
                `Unknown book alias: "${bookName}". Please check the bookAliases.config.json file.`
            );
        }

        return resolvedSlug;
    }

    /**
     * Checks if a book name or alias exists in the configuration
     * @param bookName The book name or alias to check
     * @returns True if the alias exists, false otherwise
     */
    hasAlias(bookName: string): boolean {
        this.loadConfig();

        if (!bookName || typeof bookName !== "string") {
            return false;
        }

        const normalizedBookName = bookName.trim().toLowerCase();
        return normalizedBookName in this.aliases;
    }
}
