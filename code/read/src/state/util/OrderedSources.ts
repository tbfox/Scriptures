import { getOrder } from "../../file-queries/getOrder";

export class OrderedSources {
    static prev(work: string, source: string): string {
        const orderArr = getOrder(work);
        const i = orderArr.indexOf(source) - 1;
        if (i === -1) return "__start__";

        const metadata = orderArr[i];
        if (metadata === undefined)
            throw Error(
                `Could not get the book previous to '${source}' index was ${i}`
            );

        return metadata;
    }
    static next(work: string, source: string): string {
        const orderArr = getOrder(work);
        const i = orderArr.indexOf(source) + 1;
        if (i === orderArr.length) return "__end__";

        const metadata = orderArr[i];
        if (metadata === undefined)
            throw Error(
                `Could not get the source after '${source}' index was ${i} length is ${orderArr.length}.`
            );

        return metadata;
    }
    static last(work: string): string {
        const orderArr = getOrder(work);
        if (orderArr.length === 0) throw Error(`Order array was empty`);
        return orderArr[orderArr.length - 1] || "";
    }
    static first(work: string): string {
        const orderArr = getOrder(work);
        if (orderArr.length === 0) throw Error(`Order array was empty`);
        return orderArr[0] || "";
    }
}
