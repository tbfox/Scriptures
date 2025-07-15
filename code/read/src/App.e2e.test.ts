import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { AppTestHelper } from "./test/AppTestHelper";
import { setupTestEnvironment, mockConsole } from "./test/setup";
import { Resource } from "./state/Resource";

describe("App End-to-End Tests", () => {
    let helper: AppTestHelper;
    let restoreConsole: () => void;

    beforeEach(() => {
        setupTestEnvironment();
        restoreConsole = mockConsole();

        // Start with a known scripture reference - use dnc which has special handling
        const ref = new Resource("dnc", 1, 1);
        helper = new AppTestHelper(ref);
    });

    afterEach(() => {
        helper?.destroy();
        restoreConsole?.();
    });

    test("should start in nav mode and display initial verse", async () => {
        const state = helper.getAppState();

        expect(helper.getMode()).toBe("nav");
        expect(state.verseReference).toContain("dnc");
        expect(state.verseReference).toContain("1:1");
    });

    test("should navigate to next verse with arrow keys", async () => {
        const initialState = helper.getAppState();

        await helper.pressArrowRight();

        const newState = helper.getAppState();
        expect(newState.verseReference).not.toBe(initialState.verseReference);
    });

    test("should navigate to previous verse with arrow keys", async () => {
        // Move forward first
        await helper.pressArrowRight();
        await helper.pressArrowRight();

        const beforeBack = helper.getAppState();

        await helper.pressArrowLeft();

        const afterBack = helper.getAppState();
        expect(afterBack.verseReference).not.toBe(beforeBack.verseReference);
    });

    test("should enter insert mode and allow goto", async () => {
        await helper.goTo();

        expect(helper.getMode()).toBe("insert");

        const state = helper.getAppState();
        expect(state.showInsertBuffer).toBe(true);
        expect(state.inputAction).toBe("goto");
    });

    test("should navigate to different reference via goto", async () => {
        await helper.goTo();
        await helper.typeAndEnter("dnc 2:1");

        expect(helper.getMode()).toBe("nav");

        const state = helper.getAppState();
        expect(state.verseReference).toContain("dnc");
        expect(state.verseReference).toContain("2:1");
    });

    test("should handle invalid goto gracefully", async () => {
        await helper.goTo();
        await helper.typeAndEnter("invalid reference");

        expect(helper.getMode()).toBe("nav");

        const state = helper.getAppState();
        expect(state.error).toContain("issue parsing");
    });

    test("should enter and exit insert mode with escape", async () => {
        await helper.goTo();
        expect(helper.getMode()).toBe("insert");

        await helper.pressEscape();
        expect(helper.getMode()).toBe("nav");

        const state = helper.getAppState();
        expect(state.showInsertBuffer).toBe(false);
    });

    test("should toggle bookmark", async () => {
        const initialState = helper.getAppState();
        expect(initialState.isBookMarked).toBe(false);

        await helper.toggleBookmark();

        const newState = helper.getAppState();
        expect(newState.isBookMarked).toBe(true);

        // Toggle again
        await helper.toggleBookmark();

        const finalState = helper.getAppState();
        expect(finalState.isBookMarked).toBe(false);
    });

    test("should enter select mode and navigate words", async () => {
        await helper.enterSelectMode();

        expect(helper.getMode()).toBe("select");

        const state = helper.getAppState();
        expect(state.selectedWord).toBe(0);

        await helper.pressArrowRight();

        const newState = helper.getAppState();
        expect(newState.selectedWord).toBe(1);
    });

    test("should exit select mode with quit key", async () => {
        await helper.enterSelectMode();
        expect(helper.getMode()).toBe("select");

        await helper.quit();
        expect(helper.getMode()).toBe("nav");

        const state = helper.getAppState();
        expect(state.selectedWord).toBeNull();
    });

    test("should handle complex user flow", async () => {
        // Navigate to a verse
        await helper.goTo();
        await helper.typeAndEnter("dnc 10:1");

        // Bookmark it
        await helper.toggleBookmark();

        // Enter select mode and select a word
        await helper.enterSelectMode();
        await helper.pressArrowRight();
        await helper.pressArrowRight();

        // Start linking
        await helper.pressKey("l");
        expect(helper.getMode()).toBe("insert");

        // Add a link
        await helper.typeAndEnter("dnc 20:1");

        // Should be back in nav mode
        expect(helper.getMode()).toBe("nav");

        const finalState = helper.getAppState();
        expect(finalState.isBookMarked).toBe(true);
        expect(finalState.verseReference).toContain("dnc");
        expect(finalState.verseReference).toContain("10:1");
    });

    test("should handle backspace in insert mode", async () => {
        await helper.goTo();
        await helper.type("test");

        let state = helper.getAppState();
        expect(state.buffer).toBe("test");

        // Simulate backspace
        await helper.pressKey("\x7F");

        state = helper.getAppState();
        expect(state.buffer).toBe("tes");
    });

    test("should clear error on new input", async () => {
        // Create an error
        await helper.goTo();
        await helper.typeAndEnter("invalid");

        let state = helper.getAppState();
        expect(state.error).toBeTruthy();

        // New input should clear error
        await helper.pressArrowRight();

        state = helper.getAppState();
        expect(state.error).toBeNull();
    });
});
