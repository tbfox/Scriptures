import { describe, test, expect } from "bun:test";
import { resolveReference } from "./referenceResolver";

describe("resolveReference", () => {
    test("should resolve book only reference (now defaults to chapter 1, verse 1)", () => {
        const result = resolveReference(["bofm", "1-ne"]);
        expect(result.reference).toBe("1 Nephi 1:1");
        expect(result.isValid).toBe(true);
    });

    test("should resolve book and chapter reference (now defaults to verse 1)", () => {
        const result = resolveReference(["bofm", "1-ne", "13"]);
        expect(result.reference).toBe("1 Nephi 13:1");
        expect(result.isValid).toBe(true);
    });

    test("should resolve full reference with verse", () => {
        const result = resolveReference(["bofm", "1-ne", "13", "14"]);
        expect(result.reference).toBe("1 Nephi 13:14");
        expect(result.isValid).toEqual(true);
    });

    test("should resolve chapter reference without verse (defaults to verse 1)", () => {
        const result = resolveReference(["bofm", "1-ne", "13"]);
        expect(result.reference).toBe("1 Nephi 13:1");
        expect(result.isValid).toEqual(true);
    });

    test("should resolve book reference without chapter or verse (defaults to chapter 1, verse 1)", () => {
        const result = resolveReference(["bofm", "alma"]);
        expect(result.reference).toBe("Alma 1:1");
        expect(result.isValid).toEqual(true);
    });

    test("should handle invalid inputs", () => {
        expect(resolveReference(["bofm"]).isValid).toBe(false);
        // Book-only paths now work (default to chapter 1, verse 1)
        expect(resolveReference(["bofm", "1-ne"]).isValid).toBe(true);
        // Chapter-only paths now work (default to verse 1)
        expect(resolveReference(["bofm", "1-ne", "1"]).isValid).toBe(true);
        expect(resolveReference(["bofm", "1-ne", "bob"]).isValid).toBe(false);
        expect(resolveReference(["bofm", "1-ne", "1", "bob"]).isValid).toBe(
            false,
        );
    });

    test("should reject too many path segments", () => {
        const result = resolveReference(["bofm", "1-ne", "13", "14", "extra"]);
        expect(result.isValid).toBe(false);
    });

    test("should handle edge cases", () => {
        const result1 = resolveReference(["bofm", ""]);
        expect(result1.isValid).toBe(false);

        const result2 = resolveReference(["bofm", "1-ne", "", "14"]);
        expect(result2.isValid).toBe(false);

        const result3 = resolveReference(["bofm", "1-ne", "13", ""]);
        expect(result3.isValid).toBe(false);
    });
});
