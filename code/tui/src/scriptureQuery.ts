import { useQuery } from "@tanstack/react-query"

type Ref = {
    reference: string
    verse: string
}

const req = async (source: string[]): Promise<Ref> => {
    const requestResult = await fetch(`http://localhost:3000/${source.join('/')}`)
    return await requestResult.json() as Ref;
}

export const scriptureQuery = (source: string[]) => {
    return useQuery<Ref>({
        queryKey: source || ["empty"],
        queryFn: () => req(source),
    })
}

