/**
 * Query result cache for frequently accessed data
 */
export class QueryCache {
    private cache = new Map<
        string,
        { data: any; timestamp: number; ttl: number }
    >();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    private generateKey(query: string, params: any[]): string {
        return `${query}:${JSON.stringify(params)}`;
    }

    get<T>(query: string, params: any[], ttl?: number): T | null {
        const key = this.generateKey(query, params);
        const cached = this.cache.get(key);

        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    set(query: string, params: any[], data: any, ttl?: number): void {
        const key = this.generateKey(query, params);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL,
        });
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

export const queryCache = new QueryCache();
