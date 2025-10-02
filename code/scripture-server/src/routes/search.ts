import { getSearchResults } from "../services/searchService";
import { jsonResponse } from "../utils/jsonResponse";
import { parsePath } from "../utils/parsePath";

export async function search(req: Request, reverse: boolean) {
    const { searchParams } = parsePath(req);
    const pageNumber = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("take") || "20");
    const contentIncludes = searchParams.get("text");
    const countWords = searchParams.get("count_words") === "true" || false;
    const countChars = searchParams.get("count_chars") === "true" || false;
    const removePunc = searchParams.get("no_punc") === "true" || false;
    const lower = searchParams.get("lower") === "true" || false;

    let verseWordMap = searchParams.get("word_map") === "verse" || false;
    let searchWordMap = searchParams.get("word_map") === "search" || false;

    if (searchParams.get("word_map") === "both") {
        verseWordMap = true;
        searchWordMap = true;
    }

    let res = await getSearchResults({
        contentIncludes,
        removePunc,
        countWords,
        countChars,
        pageNumber,
        pageSize,
        verseWordMap,
        searchWordMap,
        reverse,
        lower,
    });

    return jsonResponse(res);
}
