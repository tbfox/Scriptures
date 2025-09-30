import { useState } from "react";
import { type OnCommandSubmit } from "./CommandLine";
import { useAppList } from "./ListContext";
import type { ScriptureReference } from "./scriptureQuery";

const BASE_ROUTE = Bun.env.BASE_PATH || "http://localhost:3000";

const defCmd = (
    cmd: string,
    def: string,
    callback: (...args: string[]) => void,
) => {
    const c = cmd.split(" ");
    const diff = def.split(" ").map((item, i) => {
        if (c[i] === item) return "__MATCH__";
        if (item === "_") return c[i];
        return "__DIFF__";
    });
    if (diff.includes("__DIFF__")) return;
    const args = diff
        .filter((item) => item !== undefined)
        .filter((item) => item !== "__MATCH__");
    callback(...args);
};

interface VerseRecord {
    id: number;
    source: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
    path: string;
}

type SearchResults = {
    count: number;
    verses: VerseRecord[];
};

export const useCommands = () => {
    const [listCount, setListCount] = useState<number>(0);
    const { addList, rmList, addItem, selectList } = useAppList();

    const onRunCommand = (cmd: string) => {
        defCmd(cmd, "list add _", (arg) => {
            addList(arg);
        });
        defCmd(cmd, "list rm _", (arg) => {
            rmList(arg);
        });
        defCmd(cmd, "list add-item _", (arg) => {
            addItem(arg);
        });
    };

    const onSearch = async (cmd: string, base: string) => {
        const cleaned = cmd.split(" ").join("&");
        const res = (await (
            await fetch(`${BASE_ROUTE}/${base}?text=${cleaned}`)
        ).json()) as SearchResults;
        const listName = `s${listCount}?`;
        addList(listName);
        setListCount((c) => c + 1);
        selectList(listName);
        res.verses.forEach((v) => {
            addItem(v.path);
        });
    };

    const onSubmit: OnCommandSubmit = async (mode, command) => {
        if (mode === "search" || mode === "r-search")
            await onSearch(command, mode);
        if (mode === "command") onRunCommand(command);
    };

    return { onSubmit };
};
