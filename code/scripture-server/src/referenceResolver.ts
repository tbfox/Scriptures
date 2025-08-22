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
    try {
        if (!Array.isArray(pathArray) || pathArray.length === 0) {
            throw "Invalid path array"
        }

        const collection = pathArray[0]?.toLowerCase();
        if (collection !== "bom") {
            throw "Only Book of Mormon references are currently supported"
        }

        if (pathArray.length < 2) {
            throw "Book name is required"
        }

        const bookAbbr = pathArray[1]?.toLowerCase();
        if (!bookAbbr) {
            throw "Book name is required"
        }

        const fullBookName = BOM_BOOK_MAPPING[bookAbbr];

        if (!fullBookName) {
            throw `Unknown book abbreviation: ${bookAbbr}`
        }

        let reference = fullBookName;

        if (pathArray.length >= 3) {
            const chapter = pathArray[2];
            if (!chapter || chapter.trim() === "") {
                throw "Chapter cannot be empty"
            }
            if (!/^\d+$/.test(chapter)) {
                throw "Chapter must be a number"
            }
            reference += ` ${chapter}`;
        }

        if (pathArray.length >= 4) {
            const verse = pathArray[3];
            if (!verse || verse.trim() === "") {
                throw "Verse cannot be empty"
            }
            if (!/^\d+$/.test(verse)) {
                throw "Verse must be a number"
            }
            reference += `:${verse}`;
        }

        if (pathArray.length > 4) {
            throw "Too many path segments. Maximum format is: /collection/book/chapter/verse"
        }

        return {
            reference,
            isValid: true,
        };
    } catch (e) {
        if (typeof e === 'string') 
            return {
                reference: "",
                isValid: false,
                error: e
            };
    }
    return {
        reference: "",
        isValid: false,
        error: "Unknown",
    };
}

/**
 * Helper function to get all supported book abbreviations
 * @returns Array of supported book abbreviations
 */
export function getSupportedBooks(): string[] {
    return Object.keys(BOM_BOOK_MAPPING);
}
