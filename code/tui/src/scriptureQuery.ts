import { useQuery } from "@tanstack/react-query";

type Ref = {
    reference: string;
    text: string;
    next: string;
    prev: string;
    nextChap: string;
    prevChap: string;
    chapEnd: string;
    chapStart: string;
    nextBook: string;
    prevBook: string;
};

const req = async (source: string): Promise<Ref> => {
    const requestResult = await fetch(`http://localhost:3000${source}`);
    return (await requestResult.json()) as Ref;
};

export const scriptureQuery = (source: string) => {
    return useQuery<Ref>({
        queryKey: [source],
        queryFn: () => req(source),
    });
};
