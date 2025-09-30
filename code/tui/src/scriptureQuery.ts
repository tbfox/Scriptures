import { useEffect, useState } from "react";

const BASE_ROUTE = Bun.env.BASE_PATH || 'http://localhost:3000'

export type ScriptureReference = {
    reference: string;
    path: string;
    text: string;
    next: string;
    prev: string;
    nextChap: string;
    prevChap: string;
    chapEnd: string;
    chapStart: string;
    nextBook: string;
    prevBook: string;
} | "END" | 'START';

const req = async (source: string): Promise<ScriptureReference> => {
    if (source === 'START') return 'START';
    if (source === 'END') return 'END';
    const requestResult = await fetch(`${BASE_ROUTE}${source}`);
    return (await requestResult.json()) as ScriptureReference;
};

export const scriptureQuery = (source: string) => {
    const [data, setData] = useState<ScriptureReference | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>(null)
    
    useEffect(() => {
        setIsLoading(true)
        req(source)
            .then(res => {
                setData(res)
            })
            .catch((e) => {
                setError(e)
                setData(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [source])
    return {
        isLoading,
        data,
        error,
    }
};
