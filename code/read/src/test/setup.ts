import { initializePathResolver } from "../utils/pathResolver";

/**
 * Test setup utility for configuring the test environment
 */
export function setupTestEnvironment() {
    // Initialize path resolver to set ROOT_DIR environment variable
    initializePathResolver();
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
