import {  useApp, useInput } from "ink";
import { useCommandLine, type UseCommandLineResult } from "./Input";
import type { Ref } from "./scriptureQuery";

type UseIOArgs = {
    isPending: boolean
    ref: Ref | undefined
    setSource: (src: string ) => void 
    setPrevSource: () => void
}

export const useIO = ({
    isPending,
    ref,
    setSource,
    setPrevSource,
}: UseIOArgs) => {
    const cmdLine = useCommandLine()
    const { exit } = useApp()

    useInput((input, key) => {
        if (isPending || ref === undefined) return;
        if (cmdLine.isActive) {
            if (key.escape) cmdLine.exit()
            return 
        }
        if (input === "q") {
            exit()
            return
        }

        if (ref === 'END' || ref === 'START'){
            setPrevSource()
            return
        }

        if (input === ":") {
            cmdLine.cmd()
            return
        }
        if (input === "/") {
            cmdLine.search()
            return
        }
        if (input === "?") {
            cmdLine.reverseSearch()
            return
        }

        if (input === "j") setSource(ref.next);
        if (input === "k") setSource(ref.prev);
        if (input === "l") setSource(ref.nextChap);
        if (input === "h") setSource(ref.prevChap);
        if (input === "$") setSource(ref.chapEnd);
        if (input === "0") setSource(ref.chapStart);
        if (input === "n") setSource(ref.nextBook);
        if (input === "p") setSource(ref.prevBook);
    });
    return { cmdLineBinding: cmdLine.bind }
}
