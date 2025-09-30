import { Database } from "bun:sqlite";
import { DatabaseError } from "../utils/errors";
import { join } from "path";

/**
 * Centralized database connection manager with improved lifecycle management
 */
class DatabaseManager {
    private static instance: DatabaseManager;
    private db!: Database; // Using definite assignment assertion since connect() initializes it
    private isConnected: boolean = false;

    private constructor() {
        this.connect();
    }

    private connect(): void {
        if (!Bun.env.DATABASE)
            throw Error("Failed to find DATABASE env variable");
        const dbPath = join(Bun.env.DATABASE, "standard-works.sqlite");
        console.log(`Connecting to database at: ${dbPath}`);
        try {
            this.db = new Database(dbPath, { readonly: true });
            this.isConnected = true;

            try {
                this.db.exec("PRAGMA cache_size = 1000;");
                this.db.exec("PRAGMA temp_store = memory;");
            } catch (pragmaError) {
                console.warn(
                    "Some PRAGMA optimizations could not be applied to readonly database",
                );
            }
        } catch (error) {
            this.isConnected = false;
            throw new DatabaseError(
                `Failed to connect to database: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public getConnection(): Database {
        if (!this.isConnected) {
            throw new DatabaseError("Database connection is not available");
        }
        return this.db;
    }

    public isHealthy(): boolean {
        try {
            if (!this.isConnected) return false;
            const result = this.db.prepare("SELECT 1 as test").get() as
                | { test: number }
                | undefined;
            return result?.test === 1;
        } catch {
            return false;
        }
    }

    public close(): void {
        if (this.isConnected && this.db) {
            this.db.close();
            this.isConnected = false;
        }
    }

    public reconnect(): void {
        this.close();
        this.connect();
    }
}

export const dbManager = DatabaseManager.getInstance();
