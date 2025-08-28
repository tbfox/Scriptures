const chapter_count = (await Bun.file(
    import.meta.dir + "/../res/bofm_book_count.json",
).json()) as Record<string, number>;
const verse_count = (await Bun.file(
    import.meta.dir + "/../res/bofm_verse_count.json",
).json()) as Record<string, number>;

const bookArr = [
    "1-ne",
    "2-ne",
    "jacob",
    "enos",
    "jarom",
    "omni",
    "wom",
    "mosiah",
    "alma",
    "hel",
    "3-ne",
    "4-ne",
    "mormon",
    "ether",
    "moroni",
];

const nameMap: Map<string, string> = new Map([
    ["1-ne", "1_Nephi"],
    ["2-ne", "2_Nephi"],
    ["jacob", "Jacob"],
    ["enos", "Enos"],
    ["jarom", "Jarom"],
    ["omni", "Omni"],
    ["wom", "Words_of_Mormon"],
    ["mosiah", "Mosiah"],
    ["alma", "Alma"],
    ["hel", "Helaman"],
    ["3-ne", "3_Nephi"],
    ["4-ne", "4_Nephi"],
    ["mormon", "Mormon"],
    ["ether", "Ether"],
    ["moroni", "Moroni"],
]);

class Reference {
    private book: string;
    private verse: number;
    private chapter: number;
    constructor(_path: string[]) {
        this.book = _path[1] || "unknown_book";
        this.chapter = parseInt(_path[2]!);
        this.verse = parseInt(_path[3]!);
    }
    static chapterCount(bookname: string): number {
        const count = chapter_count[bookname];
        if (count === undefined) throw `Book ${bookname} not found.`;
        return count;
    }
    private incBook() {
        let i = bookArr.indexOf(this.book);
        if (i === -1) throw `Failed to retrieve book index.`;
        this.book = bookArr[i + 1] || "END";
    }
    private decBook() {
        let i = bookArr.indexOf(this.book);
        if (i === -1) throw `Failed to retrieve book index.`;
        this.book = bookArr[i - 1] || "START";
    }
    private incChapter() {
        this.chapter++;
        const maxChapters = chapter_count[nameMap.get(this.book) || "unknown"];
        if (maxChapters === undefined) throw "(incChapter) Failed to find maxChapters";
        if (this.chapter > maxChapters) {
            this.chapter = 1;
            this.incBook();
        }
    }
    private decChapter() {
        this.chapter--;
        if (this.chapter === 0) {
            this.decBook();
            if (this.book === 'START') return
            const maxChapters = chapter_count[nameMap.get(this.book) || "unknown"];
            if (maxChapters === undefined) throw "(decChapter) Failed to find maxChapters";
            this.chapter = maxChapters;
        }
    }
    incVerse() {
        this.verse++;
        const verseCountIndex = `${nameMap.get(this.book)}-${this.chapter}`;
        const maxVerses = verse_count[verseCountIndex];
        if (maxVerses === undefined) throw "(incVerse) Failed to find maxVerses";
        if (this.verse > maxVerses) {
            this.verse = 1;
            this.incChapter();
        }
    }

    decVerse() {
        this.verse--;
        if (this.verse === 0) {
            this.decChapter()
            if (this.book === "START") return
            const verseCountIndex = `${nameMap.get(this.book)}-${this.chapter}`;
            const maxVerses = verse_count[verseCountIndex];
            if (maxVerses === undefined) throw "(decVerse) Failed to find maxVerses";
            this.verse = maxVerses;
        }
    }

    getPath() {
        if (this.book === "END") return "END";
        if (this.book === "START") return "START";
        return `/bofm/${this.book}/${this.chapter}/${this.verse}`;
    }
}

export function calculatePrev(_path: string[]) {
    const ref = new Reference(_path!);
    ref.decVerse();
    return ref.getPath();
}

export function calculateNext(_path: string[]) {
    const ref = new Reference(_path!);
    ref.incVerse();
    return ref.getPath();
}
