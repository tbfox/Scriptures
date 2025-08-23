import { describe, test, expect } from "bun:test";
import { resolveReference } from "./referenceResolver";

describe("resolveReference", () => {
    test("should resolve book only reference", () => {
        const result = resolveReference(["bom", "1ne"]);
        expect(result.isValid).toBe(false);
    });

    test("should resolve book and chapter reference", () => {
        const result = resolveReference(["bom", "1ne", "13"]);
        expect(result.isValid).toBe(false);
    });

    test("should resolve full reference with verse", () => {
        const result = resolveReference(["bom", "1ne", "13", "14"]);
        expect(result.reference).toBe("1_Nephi 13:14");
        expect(result.isValid).toEqual(true);
    });

    test("should handle invalid inputs", () => {
        expect(resolveReference(["bom"]).isValid).toBe(false);
        expect(resolveReference(["bom", "1ne"]).isValid).toBe(false);
        expect(resolveReference(["bom", "1ne", "1"]).isValid).toBe(false);
        expect(resolveReference(["bom", "1ne", "bob"]).isValid).toBe(false);
        expect(resolveReference(["bom", "1ne", "1", "bob"]).isValid).toBe(
            false,
        );
    });

    test("should reject too many path segments", () => {
        const result = resolveReference(["bom", "1ne", "13", "14", "extra"]);
        expect(result.isValid).toBe(false);
    });

    test("should handle edge cases", () => {
        const result1 = resolveReference(["bom", ""]);
        expect(result1.isValid).toBe(false);

        const result2 = resolveReference(["bom", "1ne", "", "14"]);
        expect(result2.isValid).toBe(false);

        const result3 = resolveReference(["bom", "1ne", "13", ""]);
        expect(result3.isValid).toBe(false);
    });
});
