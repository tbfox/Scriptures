interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}

// Mapping of book abbreviations to full names for Book of Mormon
const BOM_BOOK_MAPPING: Record<string, string> = {
    "1ne": "1 Nephi",
    "2ne": "2 Nephi",
    jacob: "Jacob",
    enos: "Enos",
    jarom: "Jarom",
    omni: "Omni",
    wom: "Words of Mormon",
    mosiah: "Mosiah",
    alma: "Alma",
    helaman: "Helaman",
    hel: "Helaman",
    "3ne": "3 Nephi",
    "4ne": "4 Nephi",
    mormon: "Mormon",
    ether: "Ether",
    moroni: "Moroni",
};

/**
 * Resolves a path array into a scripture reference
 * @param pathArray - Array of path segments from URL (e.g., ["bom", "1ne", "13", "14"])
 * @returns Reference object with the resolved reference string and validity
 */
export function resolveReference(pathArray: string[]): Reference {
    // Basic validation
    if (!Array.isArray(pathArray) || pathArray.length === 0) {
        return {
            reference: "",
            isValid: false,
            error: "Invalid path array",
        };
    }

    // Check if first element indicates Book of Mormon
    const collection = pathArray[0]?.toLowerCase();
    if (collection !== "bom") {
        return {
            reference: "",
            isValid: false,
            error: "Only Book of Mormon references are currently supported",
        };
    }

    // Need at least book abbreviation
    if (pathArray.length < 2) {
        return {
            reference: "",
            isValid: false,
            error: "Book name is required",
        };
    }

    const bookAbbr = pathArray[1]?.toLowerCase();
    if (!bookAbbr) {
        return {
            reference: "",
            isValid: false,
            error: "Book name is required",
        };
    }

    const fullBookName = BOM_BOOK_MAPPING[bookAbbr];

    if (!fullBookName) {
        return {
            reference: "",
            isValid: false,
            error: `Unknown book abbreviation: ${bookAbbr}`,
        };
    }

    // Build reference based on available components
    let reference = fullBookName;

    // Add chapter if provided
    if (pathArray.length >= 3) {
        const chapter = pathArray[2];
        if (!chapter || chapter.trim() === "") {
            return {
                reference: "",
                isValid: false,
                error: "Chapter cannot be empty",
            };
        }
        if (!/^\d+$/.test(chapter)) {
            return {
                reference: "",
                isValid: false,
                error: "Chapter must be a number",
            };
        }
        reference += ` ${chapter}`;
    }

    // Add verse if provided
    if (pathArray.length >= 4) {
        const verse = pathArray[3];
        if (!verse || verse.trim() === "") {
            return {
                reference: "",
                isValid: false,
                error: "Verse cannot be empty",
            };
        }
        if (!/^\d+$/.test(verse)) {
            return {
                reference: "",
                isValid: false,
                error: "Verse must be a number",
            };
        }
        reference += `:${verse}`;
    }

    // Check for too many path segments
    if (pathArray.length > 4) {
        return {
            reference: "",
            isValid: false,
            error: "Too many path segments. Maximum format is: /collection/book/chapter/verse",
        };
    }

    return {
        reference,
        isValid: true,
    };
}

/**
 * Helper function to get all supported book abbreviations
 * @returns Array of supported book abbreviations
 */
export function getSupportedBooks(): string[] {
    return Object.keys(BOM_BOOK_MAPPING);
}
