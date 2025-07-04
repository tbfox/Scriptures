import { readFileSync } from "fs";

type WorkMetadata = {
    order: string[];
};

const getMetaData = (): WorkMetadata => {
    return JSON.parse(
        readFileSync(Bun.env.ROOT_DIR + `works/bom/.metadata`, "utf-8")
    );
};

export function getPrevBook(book: string): string {
    const orderArr = getMetaData().order;
    const i = orderArr.indexOf(book) - 1;
    const metadata = orderArr[i];
    if (metadata === undefined)
        throw Error(`Could not get the book previous to ${book}.`);
    return metadata;
}

export function getNext() {}
