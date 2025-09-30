import { useState } from "react";
import { scriptureQuery } from "./scriptureQuery";
import { CommandLine, useCommandLine } from "./CommandLine";
import { Box, Text } from "ink";
import { useArguments } from "./ArgumentContext";
import { useIO } from "./IO";
import { useCommands } from "./Commands";
import { ListView } from "./ListView";

type SourceData = {
    current: string
    prev: string | null
}

export const Main = () => {
    const { values } = useArguments()
    const [source, setSource] = useState<SourceData>({ current: values.ref || "/bofm/1-ne/1/1", prev: null });
    const res = scriptureQuery(source.current);

    const _setSource = (src: string | null) => {
        if (src !== null) 
            setSource({ current: src, prev: source.current })
    }

    const setPrevSource = () => {
        setSource({
            current: source.prev || 'unknown',
            prev: null
        })
    }
    
    const { onSubmit } = useCommands()
    const cmdLine = useCommandLine({ onSubmit })

    const { cmdLineBinding, mode } = useIO({ 
        setSource: _setSource,
        cmdLine,
        setPrevSource,
        isPending: res.isLoading,
        ref: res.data, 
    })
   
    if (source.current === 'START' || res.data === 'START') {
        return <Text>You are at the START of the book</Text>;
    }

    if (source.current === 'END' || res.data === 'END') {
        return <Text>You are at the END of the book</Text>;
    }
    
    if (res.error || source.current === "unknown")
        return <Text>Failed to load Scripture reference: {source.current}</Text>;

    return (
        <>
            <Box width={80}>
                <Text color="yellow">{mode}: </Text>
                <Text>{res.data?.reference}</Text>
                {res.isLoading && <Text>Loading...</Text>}
            </Box>
            <ListView />
            <Box borderStyle="single" width={80}>
                <Text>{res.data?.text}</Text>
            </Box>
            <CommandLine {...cmdLineBinding} />
        </>
    );
};
