import { readFileSync } from "fs";

export const getVerseByReference = (ref: string) => {
    const file = JSON.parse(
        readFileSync(import.meta.dir + "/../res/bom.json", "utf-8")
    );
    return file.verses.filter(
        ({ reference, text }: any) => reference === ref
    )[0].text;
};
