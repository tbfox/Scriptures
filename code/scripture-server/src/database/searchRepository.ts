import type { SearchArgs } from "../models";
import { dbManager } from "./connection";

export const count = (contentIncludes: string): any => {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT COUNT(*) as count FROM verses 
        WHERE content LIKE ?`);

    const r = query.get(`%${contentIncludes}%`) as {count: number}

    return r.count
}

export const search = ({
    contentIncludes,
    pageSize,
    pageNumber,
}: SearchArgs): any => {
    const db = dbManager.getConnection();
    const query = db.prepare(`
        SELECT * FROM verses 
        WHERE content LIKE ?
        ORDER BY id
        LIMIT ? OFFSET ?
    `);

    return query.all(
        `%${contentIncludes}%`,
        pageSize,
        pageNumber
    )
}
