import { readFileSync } from "fs";

export function getPrevBook(work: string, book: string): string {
    const orderArr = getOrder(work);
    const i = orderArr.indexOf(book) - 1;
    const metadata = orderArr[i];
    if (metadata === undefined)
        throw Error(`Could not get the book previous to '${book}'.`);
    return metadata;
}

export function getNextBook(work: string, book: string) {
    const orderArr = getOrder(work);
    const i = orderArr.indexOf(book) + 1;
    const metadata = orderArr[i];
    if (metadata === undefined)
        throw Error(`Could not get the book after '${book}'.`);
    return metadata;
}

export const getOrder = (work: string): string[] => {
    return (
        JSON.parse(
            readFileSync(Bun.env.ROOT_DIR + `works/${work}/.metadata`, "utf-8")
        ) as { order: string[] }
    ).order;
};
