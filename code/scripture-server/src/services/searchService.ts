import { count, search } from "../database/searchRepository";
import type { VerseRecord } from "../models";

type SearchResultRecord = VerseRecord & {
    word_count?: number;
    char_count?: number;
    word_map?: Record<string, number>;
};

type SearchResults = {
    count: number;
    verses: SearchResultRecord[];
    word_map?: Record<string, number>;
};

type SearchDirtyArgs = {
    contentIncludes?: string | null;
    searchWordMap: boolean;
    verseWordMap: boolean;
    countWords: boolean;
    countChars: boolean;
    removePunc: boolean;
    pageNumber: number;
    pageSize: number;
    reverse: boolean;
    lower: boolean;
};

export const getSearchResults = async ({
    contentIncludes = null,
    searchWordMap,
    verseWordMap,
    removePunc,
    countWords,
    countChars,
    pageNumber,
    pageSize,
    reverse,
    lower,
}: SearchDirtyArgs): Promise<SearchResults> => {
    if (contentIncludes === null) return { count: 0, verses: [] };

    let result = search({
        contentIncludes,
        pageSize: pageSize || 20,
        pageNumber: pageNumber || 0,
        reverse,
    }) as SearchResultRecord[];

    if (countWords) {
        result = result.map((v) => ({
            ...v,
            word_count: v.content.split(" ").length,
        }));
    }

    if (countChars) {
        result = result.map((v) => ({ ...v, char_count: v.content.length }));
    }

    if (removePunc) {
        result = result.map((v) => ({
            ...v,
            content: removePunctuation(v.content),
        }));
    }

    if (lower) {
        result = result.map((v) => ({
            ...v,
            content: v.content.toLowerCase(),
        }));
    }

    if (verseWordMap || searchWordMap) {
        result = result.map((v) => ({
            ...v,
            word_map: getWordCountMap(v.content),
        }));
    }

    if (searchWordMap) {
        const word_map = result
            .map((v) => v.word_map || {})
            .reduce((combined, current) => {
                for (const word in current) {
                    combined[word] =
                        (combined[word] || 0) + (current[word] || 0);
                }
                return combined;
            });
        if (!verseWordMap) {
            result = result.map((v) => ({ ...v, word_map: undefined }));
        }
        return {
            count: count(contentIncludes) as number,
            verses: result,
            word_map,
        };
    }

    return {
        count: count(contentIncludes) as number,
        verses: result,
    };
};

const getWordCountMap = (text: string) => {
    const words = removePunctuation(text).toLowerCase().split(" ");
    const wordCount: Record<string, number> = {};

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    }

    return wordCount;
};

const removePunctuation = (sentence: string) => {
    return sentence
        .replace(/-/g, " ")
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .trim();
};
