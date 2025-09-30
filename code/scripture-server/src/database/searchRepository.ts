import type { SearchArgs } from "../models";
import { dbManager } from "./connection";

export const count = (contentIncludes: string): any => {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT COUNT(*) as count FROM verses 
        WHERE content LIKE ?`);

    const r = query.get(`%${contentIncludes}%`) as { count: number };

    return r.count;
};

type VerseResult = {
    id: number;
    source: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
    path: string;
};

export const search = ({
    contentIncludes,
    pageSize,
    pageNumber,
    reverse,
}: SearchArgs): any => {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT * FROM verses 
        WHERE content LIKE ?
        ORDER BY id${reverse ? " DESC" : ""}
        LIMIT ? OFFSET ?
    `);

    const result = query.all(
        `%${contentIncludes}%`,
        pageSize,
        pageNumber,
    ) as VerseResult[];
    return result.map((item) => ({ ...item, path: `/${item.path}` }));
};
