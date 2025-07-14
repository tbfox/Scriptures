import { getOrder } from "./getOrder";

const bom = getOrder("bom");
const nt = getOrder("nt");
const ot = getOrder("ot");
const pgp = getOrder("pgp");

export function determineSource(source: string): string {
    if (source === "dnc") return "dnc";
    if (source === "podcast") return "notes";
    if (bom.includes(source)) return "bom";
    if (nt.includes(source)) return "nt";
    if (ot.includes(source)) return "ot";
    if (pgp.includes(source)) return "pgp";

    throw new Error(
        `Source could not be determined from the book: '${source}'`
    );
}
