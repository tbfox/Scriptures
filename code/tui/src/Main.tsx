import { useState } from "react";
import { scriptureQuery } from "./scriptureQuery";
import { CommandLine, useCommandLine } from "./Input";
import { Box, Text, useInput } from "ink";
import { useArguments } from "./ArgumentContext";
import { Log } from "./Logger";

type SourceData = {
    current: string
    prev: string | null
}


export const Main = () => {
    const { values } = useArguments()
    const [source, setSource] = useState<SourceData>({ current: values.ref || "/bofm/1-ne/1/1", prev: null });
    const commandLine = useCommandLine()
    const res = scriptureQuery(source.current);
    Log.render(Main)
    Log.obj('res', res)

    const _setSource = (src: string)=> {
        setSource({
            current: src,
            prev: source.current
        })
    }

    const setPrevSource = ()=> {
        setSource({
            current: source.prev || 'unknown',
            prev: null
        })
    }

    useInput((input) => {
        if (commandLine.mode !== null) return
        
        if (res.isPending || res.data === undefined) return;
        if (res.data === 'END' || res.data === 'START'){
            setPrevSource()
            return
        }
        if (input === "i") {
            commandLine.setMode('goto')
            return
        }

        if (input === "j") _setSource(res.data.next);
        if (input === "k") _setSource(res.data.prev);
        if (input === "l") _setSource(res.data.nextChap);
        if (input === "h") _setSource(res.data.prevChap);
        if (input === "$") _setSource(res.data.chapEnd);
        if (input === "0") _setSource(res.data.chapStart);
        if (input === "n") _setSource(res.data.nextBook);
        if (input === "p") _setSource(res.data.prevBook);
    });
    
    if (source.current === 'START' || res.data === 'START') {
        return <Text>You are at the START of the book</Text>;
    }
    if (source.current === 'END' || res.data === 'END') {
        return <Text>You are at the END of the book</Text>;
    }
    
    if (res.isError || source.current === "unknown" || !res.data)
        return <Text>Failed to load Scripture reference</Text>;

    return (
        <>
            <Box width={80}>
                <Text color="yellow">Reference: </Text>
                <Text>{res.data.reference}</Text>
                {res.isPending && <Text>Loading</Text>}
            </Box>
            <Box borderStyle="single" width={80}>
                <Text>{res.data.text}</Text>
            </Box>
            <CommandLine {...commandLine.bind} />
        </>
    );
};
