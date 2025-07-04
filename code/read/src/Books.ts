import { readFileSync } from "fs";

export function getPrevBook(book: string): string {
    const orderArr = getOrder();
    const i = orderArr.indexOf(book) - 1;
    const metadata = orderArr[i];
    if (metadata === undefined)
        throw Error(`Could not get the book previous to '${book}'.`);
    return metadata;
}

export function getNextBook(book: string) {
    const orderArr = getOrder();
    const i = orderArr.indexOf(book) + 1;
    const metadata = orderArr[i];
    if (metadata === undefined)
        throw Error(`Could not get the book after '${book}'.`);
    return metadata;
}

const getOrder = (): string[] => {
    return (
        JSON.parse(
            readFileSync(Bun.env.ROOT_DIR + `works/bom/.metadata`, "utf-8")
        ) as { order: string[] }
    ).order;
};
