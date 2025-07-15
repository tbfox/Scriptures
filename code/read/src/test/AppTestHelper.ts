import { EventEmitter } from "events";
import { App } from "../App";
import type { Resource } from "../state/Resource";

class MockStdin extends EventEmitter {
    isTTY = true;
    isRaw = false;

    setRawMode(mode: boolean) {
        this.isRaw = mode;
        return this;
    }

    resume() {
        return this;
    }

    pause() {
        return this;
    }

    // Simulate key input
    simulateInput(input: string | Buffer) {
        const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
        this.emit("data", buffer);
    }
}

class MockStdout extends EventEmitter {
    columns = 80;
    rows = 24;
    isTTY = true;

    private output: string[] = [];

    write(chunk: any) {
        this.output.push(chunk.toString());
        return true;
    }

    getOutput(): string {
        return this.output.join("");
    }

    clearOutput() {
        this.output = [];
    }

    getLastOutput(): string {
        return this.output[this.output.length - 1] || "";
    }
}

export class AppTestHelper {
    private app: App;
    private mockStdin: MockStdin;
    private mockStdout: MockStdout;
    private originalStdin: any;
    private originalStdout: any;
    private originalProcess: any;

    constructor(ref: Resource) {
        this.mockStdin = new MockStdin();
        this.mockStdout = new MockStdout();

        // Store originals
        this.originalStdin = process.stdin;
        this.originalStdout = process.stdout;
        this.originalProcess = {
            on: process.on,
            exit: process.exit,
        };

        // Mock process methods to prevent actual exit
        const mockProcessOn = (event: string, handler: any) => {
            // Don't actually register exit handlers in tests
            if (event === "exit" || event === "SIGINT" || event === "SIGTERM") {
                return;
            }
            return this.originalProcess.on.call(process, event, handler);
        };

        const mockProcessExit = () => {
            // Don't actually exit in tests
            throw new Error("Test process exit called");
        };

        // Replace with mocks BEFORE creating the app
        (global as any).process.stdin = this.mockStdin;
        (global as any).process.stdout = this.mockStdout;
        (global as any).process.on = mockProcessOn;
        (global as any).process.exit = mockProcessExit;

        // Create app instance
        this.app = new App(ref);

        // Set up stdin event listener like in the main function
        this.mockStdin.on("data", this.app.stdInDataHandler());
    }

    // Simulate various key inputs
    pressKey(key: string): Promise<void> {
        return new Promise((resolve) => {
            this.mockStdin.simulateInput(key);
            // Give a bit more time for event processing to complete
            setTimeout(resolve, 10);
        });
    }

    // Common key combinations
    async pressArrowRight(): Promise<void> {
        return this.pressKey("\x1b[C");
    }

    async pressArrowLeft(): Promise<void> {
        return this.pressKey("\x1b[D");
    }

    async pressEnter(): Promise<void> {
        return this.pressKey("\r");
    }

    async pressEscape(): Promise<void> {
        return this.pressKey("\x1b");
    }

    async pressCtrlC(): Promise<void> {
        return this.pressKey("\x03");
    }

    async type(text: string): Promise<void> {
        for (const char of text) {
            await this.pressKey(char);
        }
    }

    async typeAndEnter(text: string): Promise<void> {
        await this.type(text);
        await this.pressEnter();
    }

    // Navigation shortcuts
    async enterInsertMode(): Promise<void> {
        return this.pressKey("i");
    }

    async enterSelectMode(): Promise<void> {
        return this.pressKey("w");
    }

    async toggleBookmark(): Promise<void> {
        return this.pressKey("m");
    }

    async save(): Promise<void> {
        return this.pressKey("s");
    }

    async goTo(): Promise<void> {
        return this.pressKey("g");
    }

    async quit(): Promise<void> {
        return this.pressKey("q");
    }

    // State inspection
    getAppState() {
        return (this.app as any).context.getState();
    }

    getMode() {
        return (this.app as any).context.mode;
    }

    getCurrentReference() {
        return (this.app as any).context.nav.getCurrent();
    }

    // Output inspection
    getRenderedOutput(): string {
        return this.mockStdout.getOutput();
    }

    clearOutput(): void {
        this.mockStdout.clearOutput();
    }

    // Check if output contains specific text
    outputContains(text: string): boolean {
        return this.getRenderedOutput().includes(text);
    }

    // Cleanup
    destroy() {
        // Restore originals without triggering exit
        (global as any).process.stdin = this.originalStdin;
        (global as any).process.stdout = this.originalStdout;
        (global as any).process.on = this.originalProcess.on;
        (global as any).process.exit = this.originalProcess.exit;
    }
}
