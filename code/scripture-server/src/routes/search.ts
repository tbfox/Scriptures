import { getSearchResults } from "../services/searchService";
import { jsonResponse } from "../utils/jsonResponse";
import { parsePath } from "../utils/parsePath";

export async function search(req: Request, reverse: boolean) {
    const { searchParams } = parsePath(req);
    const contentIncludes = searchParams.get("text");
    const pageSize = parseInt(searchParams.get("take") || "20");
    const pageNumber = parseInt(searchParams.get("page") || "0");

    return jsonResponse(
        await getSearchResults({
            contentIncludes,
            pageSize,
            pageNumber,
            reverse,
        }),
    );
}
