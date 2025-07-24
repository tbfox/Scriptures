import { describe, test, expect } from "bun:test";
import { resolveReference, getSupportedBooks } from "./referenceResolver";

describe("resolveReference", () => {
    test("should resolve book only reference", () => {
        const result = resolveReference(["bom", "1ne"]);
        expect(result.isValid).toBe(true);
        expect(result.reference).toBe("1 Nephi");
        expect(result.error).toBeUndefined();
    });

    test("should resolve book and chapter reference", () => {
        const result = resolveReference(["bom", "1ne", "13"]);
        expect(result.isValid).toBe(true);
        expect(result.reference).toBe("1 Nephi 13");
        expect(result.error).toBeUndefined();
    });

    test("should resolve full reference with verse", () => {
        const result = resolveReference(["bom", "1ne", "13", "14"]);
        expect(result.isValid).toBe(true);
        expect(result.reference).toBe("1 Nephi 13:14");
        expect(result.error).toBeUndefined();
    });

    test("should handle different book abbreviations", () => {
        const testCases = [
            { input: ["bom", "2ne"], expected: "2 Nephi" },
            { input: ["bom", "jacob"], expected: "Jacob" },
            { input: ["bom", "alma", "25", "3"], expected: "Alma 25:3" },
            { input: ["bom", "moroni", "10", "34"], expected: "Moroni 10:34" },
            { input: ["bom", "3ne"], expected: "3 Nephi" },
            { input: ["bom", "wom"], expected: "Words of Mormon" },
            { input: ["bom", "hel", "5"], expected: "Helaman 5" },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = resolveReference(input);
            expect(result.isValid).toBe(true);
            expect(result.reference).toBe(expected);
        });
    });

    test("should be case insensitive", () => {
        const result1 = resolveReference(["BOM", "1NE", "13", "14"]);
        const result2 = resolveReference(["bom", "1ne", "13", "14"]);

        expect(result1.isValid).toBe(true);
        expect(result2.isValid).toBe(true);
        expect(result1.reference).toBe(result2.reference);
    });

    test("should handle invalid inputs", () => {
        // Empty array
        expect(resolveReference([]).isValid).toBe(false);
        expect(resolveReference([]).error).toBe("Invalid path array");

        // Non-BOM collection
        expect(resolveReference(["nt", "john"]).isValid).toBe(false);
        expect(resolveReference(["nt", "john"]).error).toBe(
            "Only Book of Mormon references are currently supported"
        );

        // Missing book
        expect(resolveReference(["bom"]).isValid).toBe(false);
        expect(resolveReference(["bom"]).error).toBe("Book name is required");

        // Unknown book
        expect(resolveReference(["bom", "unknown"]).isValid).toBe(false);
        expect(resolveReference(["bom", "unknown"]).error).toBe(
            "Unknown book abbreviation: unknown"
        );
    });

    test("should validate chapter and verse as numbers", () => {
        // Invalid chapter
        const result1 = resolveReference(["bom", "1ne", "abc"]);
        expect(result1.isValid).toBe(false);
        expect(result1.error).toBe("Chapter must be a number");

        // Invalid verse
        const result2 = resolveReference(["bom", "1ne", "13", "xyz"]);
        expect(result2.isValid).toBe(false);
        expect(result2.error).toBe("Verse must be a number");
    });

    test("should reject too many path segments", () => {
        const result = resolveReference(["bom", "1ne", "13", "14", "extra"]);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(
            "Too many path segments. Maximum format is: /collection/book/chapter/verse"
        );
    });

    test("should handle edge cases", () => {
        // Empty string elements
        const result1 = resolveReference(["bom", ""]);
        expect(result1.isValid).toBe(false);
        expect(result1.error).toBe("Book name is required");

        // Empty chapter
        const result2 = resolveReference(["bom", "1ne", "", "14"]);
        expect(result2.isValid).toBe(false);
        expect(result2.error).toBe("Chapter cannot be empty");

        // Empty verse
        const result3 = resolveReference(["bom", "1ne", "13", ""]);
        expect(result3.isValid).toBe(false);
        expect(result3.error).toBe("Verse cannot be empty");
    });
});

describe("getSupportedBooks", () => {
    test("should return array of book abbreviations", () => {
        const books = getSupportedBooks();
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeGreaterThan(0);
        expect(books).toContain("1ne");
        expect(books).toContain("alma");
        expect(books).toContain("moroni");
    });
});

// Integration-style tests that match the example from the user
describe("Integration examples", () => {
    test("should handle the user's example correctly", () => {
        // User's example: ["bom","1ne","13","14"] should work
        const result = resolveReference(["bom", "1ne", "13", "14"]);
        expect(result.isValid).toBe(true);
        expect(result.reference).toBe("1 Nephi 13:14");
    });

    test("should handle real scripture references from the JSON", () => {
        // These are based on actual references I saw in the bom.json file
        const testCases = [
            { input: ["bom", "alma", "25", "3"], expected: "Alma 25:3" },
            { input: ["bom", "moroni", "10", "34"], expected: "Moroni 10:34" },
            { input: ["bom", "1ne"], expected: "1 Nephi" },
            { input: ["bom", "mosiah", "9"], expected: "Mosiah 9" },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = resolveReference(input);
            expect(result.isValid).toBe(true);
            expect(result.reference).toBe(expected);
        });
    });
});
