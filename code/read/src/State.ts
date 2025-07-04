import { readFileSync } from "fs";
import { getVerseMetadata } from "./getVerseMetadata";
import type { ReferenceStruct } from "../types/ReferenceStruct";
import { getNextBook, getPrevBook } from "./Books";
import { StandardNavigator } from "./StandardNavigator";

export type OutputState = {
    verseText: string;
    error: string | null;
};

const getScripture = (path: string) => {
    return readFileSync(Bun.env.ROOT_DIR + path, "utf-8");
};
// "works/bom/alma/32/25.txt";
const mkPath = ({ book, chapter, verse }: ReferenceStruct) => {
    return `works/bom/${book}/${chapter}/${verse}.txt`;
};

export class State {
    private nav: StandardNavigator;
    private ref: ReferenceStruct = {
        book: "alma",
        chapter: 1,
        verse: 5,
    };

    private content: string;
    private error: string | null = null;
    constructor() {
        this.content = getScripture(mkPath(this.ref));
        this.nav = new StandardNavigator(
            "bom",
            this.ref.book,
            this.ref.chapter,
            this.ref.verse
        );
    }
    inc = () => {
        this.nav.getNextVerse();

        // this.ref.verse += 1;
        // const { verses, chapters } = getVerseMetadata(mkPath(this.ref));
        // if (this.ref.verse > verses) {
        //     this.ref.verse = 1;
        //     this.ref.chapter += 1;
        //     if (this.ref.chapter > chapters) {
        //         this.ref.book = getNextBook(this.ref.book);
        //         this.ref.chapter = 1;
        //     }
        // }
        // this.content = getScripture(mkPath(this.ref));
    };
    dec = () => {
        this.nav.getPrevVerse();
        // this.ref.verse -= 1;
        // if (this.ref.verse === 0) {
        //     this.ref.chapter -= 1;
        //     if (this.ref.chapter === 0) {
        //         const prevBook = getPrevBook(this.ref.book);
        //         const { chapters } = getVerseMetadata(
        //             mkPath({ book: prevBook, chapter: 1, verse: 1 })
        //         );
        //         this.ref.book = prevBook;
        //         this.ref.chapter = chapters;
        //     }
        //     const { verses } = getVerseMetadata(mkPath(this.ref));
        //     this.ref.verse = verses;
        // }
        // this.content = getScripture(mkPath(this.ref));
    };
    getState = (): OutputState => {
        const { book, chapter, verse, text } = this.nav.getState();
        return {
            verseText: `${book} ${chapter}:${verse} ${text}`,
            error: this.error,
        };
    };
}
