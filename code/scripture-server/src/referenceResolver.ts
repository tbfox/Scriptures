interface Reference {
    reference: string;
    isValid: boolean;
    error?: string;
}

const nameMap: Map<string, string> = new Map([
    ["1ne", "1_Nephi"],
    ["2ne", "2_Nephi"],
    ['jacob', "Jacob"],
    ['enos', "Enos"],
    ['jarom', "Jarom"],
    ['omni', "Omni"],
    ['wom', "Words_of_Mormon"],
    ['mosiah', "Mosiah"],
    ['alma', "Alma"],
    ['hel', "Helaman"],
    ["3ne", "3_Nephi"],
    ["4ne", "4_Nephi"],
    ['mormon', "Mormon"],
    ['ether', "Ether"],
    ['moroni', "Moroni"],
]);

function validate(path: string[]): [string, string, string, string] {
    if (path.length < 1) throw "Source name is required."
    if (path.length < 2) throw "Book name is required."
    if (path.length < 3) throw "Chapter is required."
    if (path.length < 4) throw "Verse is required."
    if (path.length > 4) throw "Too many arguments. Format: /source/book/chapter/verse"

    const book = path[1]!
    
    if (nameMap.get(book) === undefined) 
        throw `Book '${book}' does not exist in the Book of Mormon.`
    
    if (!/^\d+$/.test(path[2]!))
        throw `Chapter '${path[2]}' is not a number.`
    
    if (!/^\d+$/.test(path[3]!))
        throw `Verse '${path[3]}' is not a number.`

    return path as [string, string, string, string]
}

export function resolveReference(path: string[]): Reference {
    try {
        path = validate(path)
        
        const bookCode = path[1]!
        const book = nameMap.get(bookCode)

        if (book === undefined)
            throw `Book '${bookCode}' does not exist in the Book of Mormon.`
        const reference = `${book} ${path[2]}:${path[3]}`;
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

