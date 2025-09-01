/**
 * Custom error classes for the scripture server
 */

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

/**
 * Helper function to determine HTTP status code from error type
 */
export function getErrorStatusCode(error: Error): number {
    if (error instanceof ValidationError) return 400;
    if (error instanceof NotFoundError) return 404;
    if (error instanceof DatabaseError) return 500;
    return 500; // Default to internal server error
}
