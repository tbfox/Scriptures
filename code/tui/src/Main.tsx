import { useState } from "react";
import { scriptureQuery } from "./scriptureQuery";
import { CommandLine } from "./Input";
import { Box, Text } from "ink";
import { useArguments } from "./ArgumentContext";
import { Log } from "./Logger";
import { useIO } from "./IO";

type SourceData = {
    current: string
    prev: string | null
}


export const Main = () => {
    const { values } = useArguments()
    const [source, setSource] = useState<SourceData>({ current: values.ref || "/bofm/1-ne/1/1", prev: null });
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

    const {cmdLineBinding} = useIO({ 
        setSource: _setSource,
        setPrevSource,
        isPending: res.isPending ,
        ref: res.data, 
    })
    
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
            <CommandLine {...cmdLineBinding} />
        </>
    );
};
