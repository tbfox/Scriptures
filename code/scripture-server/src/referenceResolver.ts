interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}


const sources: Map<string, string> = new Map([
    ["bofm", "Book of Mormon"],
    ["nt", "New Testament"],
    ["ot", "Old Testament"],
    ["pgp", "Pearl of Great Price"],
    ["dnc", "Doctrine and Covenents"],
    ["dc-testament", "Doctrine and Covenents"],
]);

const bofmMap: Map<string, string> = new Map([
    ["1-ne", "1_Nephi"],
    ["2-ne", "2_Nephi"],
    ["jacob", "Jacob"],
    ["enos", "Enos"],
    ["jarom", "Jarom"],
    ["omni", "Omni"],
    ["w-of-m", "Words_of_Mormon"],
    ["mosiah", "Mosiah"],
    ["alma", "Alma"],
    ["hel", "Helaman"],
    ["3-ne", "3_Nephi"],
    ["4-ne", "4_Nephi"],
    ["morm", "Mormon"],
    ["ether", "Ether"],
    ["moro", "Moroni"],
]);

export function validatePath(path: string[]): [string, string, string, string] {
    if (path.length < 1) throw "Source name is required.";
    if (path.length < 2) throw "Book name is required.";
    if (path.length < 3) throw "Chapter is required.";
    if (path.length < 4) throw "Verse is required.";
    if (path.length > 4)
        throw "Too many arguments. Format: /source/book/chapter/verse";

    let source = path[0]!  
    
    if (source === 'dnc') { source = 'dc-testament' }

    if (!sources.has(source)) {
        throw `Source '${source}' is not a valid source.`;
    }

    const book = path[1]!;

    if (bofmMap.get(book) === undefined)
        throw `Book '${book}' does not exist in the Book of Mormon.`;

    if (!/^\d+$/.test(path[2]!)) throw `Chapter '${path[2]}' is not a number.`;

    if (!/^\d+$/.test(path[3]!)) throw `Verse '${path[3]}' is not a number.`;

    return path as [string, string, string, string];
}

export function resolveReference(path: string[]): Reference {
    try {
        path = validatePath(path);

        const bookCode = path[1]!;
        const book = bofmMap.get(bookCode);

        if (book === undefined)
            throw `Book '${bookCode}' does not exist in the Book of Mormon.`;

        const reference = `${book} ${path[2]}:${path[3]}`;

        return {
            reference,
            isValid: true,
        };
    } catch (e) {
        if (typeof e === "string")
            return {
                reference: "",
                isValid: false,
                error: e,
            };
    }

    return {
        reference: "",
        isValid: false,
        error: "Unknown",
    };
}
