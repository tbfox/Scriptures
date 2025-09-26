import { count, search } from "../database/searchRepository";
import type { VerseRecord } from "../models";

type SearchResults = {
    count: number;
    verses: VerseRecord[];
};

type SearchDirtyArgs = {
    contentIncludes?: string | null;
    pageSize: number;
    pageNumber: number;
    reverse: boolean;
};

export const getSearchResults = async ({
    contentIncludes = null,
    pageSize,
    pageNumber,
    reverse,
}: SearchDirtyArgs): Promise<SearchResults> => {
    if (contentIncludes === null) return { count: 0, verses: [] };

    const result = search({
        contentIncludes,
        pageSize: pageSize || 20,
        pageNumber: pageNumber || 0,
        reverse,
    }) as VerseRecord[];

    return {
        count: count(contentIncludes) as number,
        verses: result,
    };
};
