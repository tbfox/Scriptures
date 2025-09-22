import { getSearchResults } from "../services/searchService";
import { jsonResponse } from "../utils/jsonResponse";
import { parsePath } from "../utils/parsePath";

export async function search(req: Request) {
    const { searchParams } = parsePath(req);
    const contentIncludes = searchParams.get("content_includes");
    const pageSize = parseInt(
        searchParams.get("page_size") || "20",
    );
    const pageNumber = parseInt(searchParams.get("page") || "0");

    return jsonResponse(
        await getSearchResults({
            contentIncludes,
            pageSize,
            pageNumber,
        }),
    );
}
