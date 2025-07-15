import { parseReference } from "../parsers/parseReference";

export class Resource {
    constructor(
        public source: string,
        public chapter: number,
        public verse: number
    ) {}
    static getId = ({ source, chapter, verse }: Resource) =>
        `${source} ${chapter}:${verse}`;

    static parse = (ref: string) => parseReference(ref);
}
