/**
 * Test setup utility for configuring the test environment
 */
export function setupTestEnvironment() {
    // Set up the ROOT_DIR environment variable for tests
    if (!process.env.ROOT_DIR) {
        process.env.ROOT_DIR = process.cwd() + "/../../";
    }
}

/**
 * Mock console methods to avoid noise in test output
 */
export function mockConsole() {
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
    };

    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};

    return () => {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
    };
}
