import React, { useState } from "react";
import { parseArgs } from "util";
import { render, Box, Text, useInput } from "ink";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { scriptureQuery } from "./src/scriptureQuery";

process.stdout.write(`\x1b[2J`) // clear screen
process.stdout.write(`\x1b[H`)  // cursor home

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        ref: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Main />
        </QueryClientProvider>
    );
};

type SourceData = {
    current: string
    prev: string | null
}

const Main = () => {
    const [source, setSource] = useState<SourceData>({ current: values.ref || "/bofm/1-ne/1/1", prev: null });
    const res = scriptureQuery(source.current);
    
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
        
        if (res.isPending || res.data === undefined) return;
        if (res.data === 'END' || res.data === 'START'){
            setPrevSource()
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
    
    if (source.current === 'START') {
        return <Text>You are at the START of the book</Text>;
    }
    if (source.current === 'END') {
        return <Text>You are at the END of the book</Text>;
    }
    
    if (res.isError || source.current === "unknown")
        return <Text>Failed to load Scripture reference</Text>;
    return (
        <>
            <Box width={80}>
                <Text color="yellow">Reference: </Text>
                <Text>{res.data?.reference}</Text>
                {res.isPending && <Text>Loading</Text>}
            </Box>
            <Box borderStyle="single" width={80}>
                <Text>{res.data?.text}</Text>
            </Box>
        </>
    );
};

render(<App />);
