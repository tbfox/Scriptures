import { getOrder } from "../../file-queries/getOrder";

export class Books {
    static prev(work: string, book: string): string {
        const orderArr = getOrder(work);
        const i = orderArr.indexOf(book) - 1;
        const metadata = orderArr[i];
        if (metadata === undefined)
            throw Error(`Could not get the book previous to '${book}'.`);
        return metadata;
    }
    static next(work: string, book: string) {
        const orderArr = getOrder(work);
        const i = orderArr.indexOf(book) + 1;
        const metadata = orderArr[i];
        if (metadata === undefined)
            throw Error(`Could not get the book after '${book}'.`);
        return metadata;
    }
}
