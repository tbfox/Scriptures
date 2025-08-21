import React, {useState, useEffect} from 'react';
import {render, Box, Text, useInput} from 'ink';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { scriptureQuery } from './src/scriptureQuery';

const queryClient = new QueryClient();

const Counter = () => {
    
	return (
        <QueryClientProvider client={queryClient}>
            <Comp />
        </QueryClientProvider>
    )

};

const Comp = () => {
    const [source, setSource] = useState<string[]>(['bom','1ne', '1', '1'])
    const res = scriptureQuery(source)

    useInput((input, key) => {
       if (input === 'j') {
           setSource(['bom','1ne', '1', '2'])
       }
    })
    
    if (res.isPending) return <Text>Loading...</Text>
    if (res.error) return <Text>Error: {JSON.stringify(res.error)}</Text>
	
    return (
        <>
            <Box>
                <Text color="yellow">Reference: </Text>
                <Text>{res.data.reference}</Text>
            </Box>
            <Box borderStyle='single'>
                <Text>{res.data.verse}</Text>
            </Box>
        </>
    )
};

render(<Counter />);
