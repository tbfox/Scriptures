import {  useApp, useInput } from "ink";
import { type UseCommandLineResult,  } from "./Input";
import type { Ref } from "./scriptureQuery";

type UseIOArgs = {
    isPending: boolean
    ref: Ref | undefined
    cmdLine: UseCommandLineResult
    setSource: (src: string ) => void 
    setPrevSource: () => void
}

export const useIO = ({
    isPending,
    ref,
    cmdLine,
    setSource,
    setPrevSource,
}: UseIOArgs) => {
    const { exit } = useApp()
    
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
        switch(input) {
            case "q": exit()
                break;
            case ":": cmdLine.cmd()
                break;
            case "/": cmdLine.search()
                break;
            case "?": cmdLine.reverseSearch()
                break;
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
            default:
        }
    });
    return { cmdLineBinding: cmdLine.bind }
}
