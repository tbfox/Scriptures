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

const Main = () => {
    const [source, setSource] = useState<string>(values.ref || "/bom/1ne/1/1");
    const res = scriptureQuery(source);

    useInput((input) => {
        if (res.isPending || res.data === undefined) return;
        if (input === "j") setSource(res.data.next);
        if (input === "k") setSource(res.data.prev);
    });

    if (source === "unknown")
        return <Text>Failed to load Scripture reference</Text>;

    return (
        <>
            <Box>
                <Text color="yellow">Reference: </Text>
                <Text>{res.data?.reference}</Text>
                {res.isPending && <Text>Loading</Text>}
            </Box>
            <Box borderStyle="single">
                <Text>{res.data?.text}</Text>
            </Box>
        </>
    );
};

render(<App />);
