import type { ZodObject, ZodSafeParseResult } from "zod"

export const ssFetch = async <T>(route: string, Schema: ZodObject): Promise<ZodSafeParseResult<T>> => {
    try {
        const res = await fetch(route)
        const json = await res.json()
        return Schema.safeParse(json)
    } catch (e) {
         
    }finally {
    }
}
