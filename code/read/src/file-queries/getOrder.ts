import { readFileSync } from "fs";
import { resolveWorkspacePath } from "./pathResolver";

export const getOrder = (work: string): string[] => {
    const basePath = work === "notes" ? "notes" : `works/${work}`;
    return (
        JSON.parse(
            readFileSync(resolveWorkspacePath(`${basePath}/.metadata`), "utf-8")
        ) as { order: string[] }
    ).order;
};
