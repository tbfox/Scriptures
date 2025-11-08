import z, { ZodError, type ZodSafeParseResult } from "zod"
import { ssFetch } from "./ssFetch"

const HealthSchema = z.object({
    status: z.literal(["healthy", 'unhealthy']),
    timestamp: z.iso.datetime(),
})

type HealthResponse = z.infer<typeof HealthSchema>
export type HealthResult = Promise<ZodSafeParseResult<HealthResponse>>

export const health = async (base: string): HealthResult => {
    try {
        const res = await fetch(base + '/health')
        const json = await res.json()
        return HealthSchema.safeParse(json)
    } catch (e) {
        if (e instanceof ZodError){
            return {
                data: undefined,
                success: false,
                error: new ZodError(e)
            }
        }
        return Promise.resolve(hr)
    }
}
