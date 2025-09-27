import {  useApp, useInput } from "ink";
import { type UseCommandLineResult,  } from "./CommandLine";
import type { Ref } from "./scriptureQuery";
import { useState } from "react";
import { useAppList } from "./ListContext";

type UseIOArgs = {
    isPending: boolean
    ref: Ref | undefined
    cmdLine: UseCommandLineResult
    setSource: (src: string | null) => void 
    setPrevSource: () => void
}

type IOMode = 'Reader' | 'List'

export const useIO = ({
    isPending,
    ref,
    cmdLine,
    setSource,
    setPrevSource,
}: UseIOArgs) => {
    const { exit } = useApp()
    const [mode, setMode] = useState<IOMode>('Reader') 
    const lists = useAppList()

    useInput((input, key) => {
        if (isPending || ref === undefined) return;
        if (cmdLine.isActive) {
            if (key.escape) cmdLine.exit()
            return 
        }
        if (ref === 'END' || ref === 'START'){
            setPrevSource()
            return
        }
        if (input === 'q') {
            exit()
            return
        }
        if (input === ':') {
            cmdLine.cmd()
            return
        }
        if (input === "/") {
            cmdLine.search(); 
            return
        }
        if (input === "?") {
            cmdLine.reverseSearch(); 
            return
        }
        if (mode === 'Reader') {
            switch(input) {
                case "j": setSource(ref.next);
                    break;
                case "k": setSource(ref.prev);
                    break;
                case "l": setSource(ref.nextChap);
                    break;
                case "h": setSource(ref.prevChap);
                    break;
                case "$": setSource(ref.chapEnd);
                    break;
                case "0": setSource(ref.chapStart);
                    break;
                case "n": setSource(ref.nextBook);
                    break;
                case "p": setSource(ref.prevBook);
                    break;
                case "m": lists.addItem(ref.path)
                    break;
                case "L": setMode("List")
                    break;
                default:
            }
        } else if (mode === 'List') {
            switch(input) {
                case "R": setMode("Reader")
                    break;
                case "j": setSource(lists.next());
                    break;
                case "k": setSource(lists.prev())
                    break;
                case "l": lists.nextList()
                    break;
                case "h": lists.prevList()
                    break;
                case "$": lists.goToLastInList()
                    break;
                case "0": lists.goToFirstInList()
                    break;
                case "m": lists.addItem(ref.path)
                    break;
                default:
            }
        }
    });
    return { 
        cmdLineBinding: cmdLine.bind,
        mode,
    }
}
