import { Aliases } from "./Aliases";

const aliases = new Aliases();

describe(Aliases.name, () => {
    test('should resolve "2 Cor" to "2_corinthians"', () => {
        const result = aliases.resolve("2 Cor");
        expect(result).toBe("2_corinthians");
    });

    test('should resolve "2cr" to "2_corinthians"', () => {
        const result = aliases.resolve("2cr");
        expect(result).toBe("2_corinthians");
    });

    test('should resolve "2 Ne" to "2_nephi"', () => {
        const result = aliases.resolve("2 Ne");
        expect(result).toBe("2_nephi");
    });

    test("should be case insensitive", () => {
        expect(aliases.resolve("MATT")).toBe("matthew");
        expect(aliases.resolve("matt")).toBe("matthew");
        expect(aliases.resolve("Matt")).toBe("matthew");
        expect(aliases.resolve("MaTt")).toBe("matthew");
    });

    test("should handle whitespace trimming", () => {
        expect(aliases.resolve("  Matt  ")).toBe("matthew");
        expect(aliases.resolve("\tJohn\n")).toBe("john");
    });

    test("should resolve Book of Mormon references", () => {
        expect(aliases.resolve("1 Nephi")).toBe("1_nephi");
        expect(aliases.resolve("1 Ne")).toBe("1_nephi");
        expect(aliases.resolve("Alma")).toBe("alma");
        expect(aliases.resolve("Moroni")).toBe("moroni");
    });

    test("should resolve D&C references", () => {
        expect(aliases.resolve("D&C")).toBe("doctrine_and_covenants");
        expect(aliases.resolve("dc")).toBe("doctrine_and_covenants");
    });

    test("should throw error for unknown alias", () => {
        expect(() => {
            aliases.resolve("Unknown Book");
        }).toThrow();
    });

    test("should throw error for empty string", () => {
        expect(() => {
            aliases.resolve("");
        }).toThrow();
    });

    test("should throw error for null/undefined", () => {
        expect(() => {
            aliases.resolve(null as any);
        }).toThrow();

        expect(() => {
            aliases.resolve(undefined as any);
        }).toThrow();
    });
});
