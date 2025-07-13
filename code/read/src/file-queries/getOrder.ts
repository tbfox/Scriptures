import { readFileSync } from "fs";

export const getOrder = (work: string): string[] => {
    const basePath = work === "notes" ? "notes" : `works/${work}`;
    return (
        JSON.parse(
            readFileSync(Bun.env.ROOT_DIR + `${basePath}/.metadata`, "utf-8")
        ) as { order: string[] }
    ).order;
};
