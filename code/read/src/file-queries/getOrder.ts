import { readFileSync } from "fs";

export const getOrder = (work: string): string[] => {
    return (
        JSON.parse(
            readFileSync(Bun.env.ROOT_DIR + `works/${work}/.metadata`, "utf-8")
        ) as { order: string[] }
    ).order;
};
