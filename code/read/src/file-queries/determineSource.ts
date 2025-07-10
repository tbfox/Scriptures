import { getOrder } from "./getOrder";

const bom = getOrder("bom");
const nt = getOrder("nt");
const ot = getOrder("ot");
const pgp = getOrder("pgp");

export function determineSource(book: string): string {
    if (book === "dnc") return "dnc";
    if (bom.includes(book)) return "bom";
    if (nt.includes(book)) return "nt";
    if (ot.includes(book)) return "ot";
    if (pgp.includes(book)) return "pgp";

    throw new Error(`Source could not be determined from the book: '${book}'`);
}
