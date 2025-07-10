import { parseReference } from "./parseReference";

describe(parseReference.name, () => {
    test('should correctly parse a simple reference like "Matt 3:1"', () => {
        const result = parseReference("Matt 3:1");
        expect(result).toEqual({ book: "Matt", chapter: 3, verse: 1 });
    });

    test('should correctly parse a reference with a leading number like "1 Nephi 6:17"', () => {
        const result = parseReference("1 Nephi 6:17");
        expect(result).toEqual({ book: "1 Nephi", chapter: 6, verse: 17 });
    });

    test('should correctly parse a reference with an ampersand like "D&C 121:6"', () => {
        const result = parseReference("D&C 121:6");
        expect(result).toEqual({ book: "D&C", chapter: 121, verse: 6 });
    });

    test('should correctly parse "John 3:16"', () => {
        const result = parseReference("John 3:16");
        expect(result).toEqual({ book: "John", chapter: 3, verse: 16 });
    });

    test('should correctly parse "Alma 32:21"', () => {
        const result = parseReference("Alma 32:21");
        expect(result).toEqual({ book: "Alma", chapter: 32, verse: 21 });
    });

    test('should correctly parse "2 Cor 5:7"', () => {
        const result = parseReference("2 Cor 5:7");
        expect(result).toEqual({ book: "2 Cor", chapter: 5, verse: 7 });
    });

    // New tests for partial references
    test('should correctly parse a partial reference with book and chapter like "Matt 5"', () => {
        const result = parseReference("Matt 5");
        expect(result).toEqual({ book: "Matt", chapter: 5, verse: 1 });
    });

    test('should correctly parse a partial reference with only book like "Matt"', () => {
        const result = parseReference("Matt");
        expect(result).toEqual({ book: "Matt", chapter: 1, verse: 1 });
    });

    test('should correctly parse a partial reference with numbered book and chapter like "1 Nephi 6"', () => {
        const result = parseReference("1 Nephi 6");
        expect(result).toEqual({ book: "1 Nephi", chapter: 6, verse: 1 });
    });

    test('should correctly parse a partial reference with only numbered book like "1 Nephi"', () => {
        const result = parseReference("1 Nephi");
        expect(result).toEqual({ book: "1 Nephi", chapter: 1, verse: 1 });
    });

    test('should correctly parse a partial reference with book containing ampersand like "D&C 121"', () => {
        const result = parseReference("D&C 121");
        expect(result).toEqual({ book: "D&C", chapter: 121, verse: 1 });
    });

    test('should correctly parse a partial reference with only book containing ampersand like "D&C"', () => {
        const result = parseReference("D&C");
        expect(result).toEqual({ book: "D&C", chapter: 1, verse: 1 });
    });

    test('should return null for an invalid format string with special characters like "Invalid@Reference"', () => {
        expect(() => parseReference("Invalid@Reference")).toThrow();
    });

    test('should return null for a reference missing a verse number like "Gen 1:"', () => {
        expect(() => parseReference("Gen 1:")).toThrow();
    });

    test('should return null for a reference with incorrect delimiters like "1 Ne 6 17"', () => {
        expect(() => parseReference("1 Ne 6 17")).toThrow();
    });

    test("should return null for an empty string", () => {
        expect(() => parseReference("")).toThrow();
    });

    test("should return null for a reference with non-numeric chapter/verse", () => {
        expect(() => parseReference("Matt A:B")).toThrow();
    });
});
