import { parseReference } from "../src/aliasing/parseReference";

export class Resource {
    constructor(
        public book: string,
        public chapter: number,
        public verse: number
    ) {}
    static getId = ({ book, chapter, verse }: Resource) =>
        `${book} ${chapter}:${verse}`;
    static parse = (ref: string) => parseReference(ref);
}
