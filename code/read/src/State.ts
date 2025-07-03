import { readFileSync } from "fs";

export type OutputState = {
    verseText: string;
};

const getScripture = () => {
    return readFileSync(
        Bun.env.ROOT_DIR + "works/bom/1_nephi/2/15.txt",
        "utf-8"
    );
};

export class State {
    private str: string = "start";
    inc = () => {
        this.str = getScripture();
    };
    dec = () => {
        this.str = "minus";
    };
    getState = (): OutputState => {
        return {
            verseText: this.str,
        };
    };
}
