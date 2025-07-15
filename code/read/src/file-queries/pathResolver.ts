import { join, resolve, dirname } from "path";
import { existsSync } from "fs";

/**
 * Finds the project root directory by looking for package.json
 * starting from the current file's directory and walking up
 */
function findProjectRoot(): string {
    let currentDir = dirname(import.meta.url.replace("file://", ""));

    while (currentDir !== "/") {
        // Look for package.json in code/read directory structure
        const packageJsonPath = join(currentDir, "package.json");
        if (existsSync(packageJsonPath)) {
            return currentDir;
        }

        // Also check for the scriptures workspace root (two levels up from code/read)
        const workspaceRoot = join(currentDir, "..", "..");
        const workspaceMarkers = [
            join(workspaceRoot, "works"),
            join(workspaceRoot, "config"),
            join(workspaceRoot, "user-data"),
        ];

        if (workspaceMarkers.every((marker) => existsSync(marker))) {
            return workspaceRoot;
        }

        currentDir = dirname(currentDir);
    }

    throw new Error("Could not find project root directory");
}

/**
 * Gets the absolute path to the workspace root
 */
export function getWorkspaceRoot(): string {
    // Check if ROOT_DIR is already set
    if (process.env.ROOT_DIR) {
        return process.env.ROOT_DIR;
    }

    // Find and set the project root
    const projectRoot = findProjectRoot();

    // If we're in the code/read directory, go up two levels to get to workspace root
    if (projectRoot.endsWith("code/read")) {
        const workspaceRoot = join(projectRoot, "..", "..");
        process.env.ROOT_DIR = workspaceRoot;
        return workspaceRoot;
    }

    // Otherwise, assume we're already at the workspace root
    process.env.ROOT_DIR = projectRoot;
    return projectRoot;
}

/**
 * Resolves a path relative to the workspace root
 */
export function resolveWorkspacePath(relativePath: string): string {
    const workspaceRoot = getWorkspaceRoot();
    return resolve(workspaceRoot, relativePath);
}

/**
 * Initialize the path resolver - this should be called early in the application
 */
export function initializePathResolver(): void {
    getWorkspaceRoot();
}
