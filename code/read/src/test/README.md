# End-to-End Testing with AppTestHelper

This directory contains utilities for testing the terminal application end-to-end by mocking stdin/stdout and simulating user input.

## AppTestHelper

The `AppTestHelper` class provides a comprehensive testing framework for your terminal application that:

-   Mocks `process.stdin` and `process.stdout`
-   Simulates user input (key presses, typing)
-   Captures rendered output
-   Provides access to internal app state
-   Prevents actual process exit during tests

### Basic Usage

```typescript
import { AppTestHelper } from "./test/AppTestHelper";
import { Resource } from "./state/Resource";
import { setupTestEnvironment } from "./test/setup";

test("My test", async () => {
    setupTestEnvironment();

    const ref = new Resource("dnc", 1, 1);
    const helper = new AppTestHelper(ref);

    // Simulate user input
    await helper.pressKey("g"); // Press 'g' key
    await helper.type("dnc 10:1"); // Type text
    await helper.pressEnter(); // Press Enter

    // Check app state
    expect(helper.getMode()).toBe("nav");
    expect(helper.getAppState().verseReference).toContain("10:1");

    helper.destroy();
});
```

### Available Methods

#### Input Simulation

-   `pressKey(key: string)` - Simulate any key press
-   `pressArrowRight()`, `pressArrowLeft()` - Navigate with arrows
-   `pressEnter()`, `pressEscape()`, `pressCtrlC()` - Common keys
-   `type(text: string)` - Type multiple characters
-   `typeAndEnter(text: string)` - Type text and press Enter

#### App-Specific Actions

-   `goTo()` - Press 'g' to enter goto mode
-   `enterInsertMode()` - Press 'i' to enter insert mode
-   `enterSelectMode()` - Press 'w' to enter select mode
-   `toggleBookmark()` - Press 'm' to toggle bookmark
-   `save()` - Press 's' to save
-   `quit()` - Press 'q' to quit

#### State Inspection

-   `getAppState()` - Get full app state
-   `getMode()` - Get current mode ("nav", "insert", "select")
-   `getCurrentReference()` - Get current scripture reference
-   `getRenderedOutput()` - Get all rendered output as string
-   `outputContains(text: string)` - Check if output contains text

### Test Setup

Always use the setup utilities:

```typescript
import { setupTestEnvironment, mockConsole } from "./test/setup";

beforeEach(() => {
    setupTestEnvironment();
    restoreConsole = mockConsole();
});

afterEach(() => {
    helper?.destroy();
    restoreConsole?.();
});
```

### Resource References

Use valid resource references for testing:

-   `new Resource("dnc", 1, 1)` - Doctrine & Covenants 1:1
-   `Resource.parse("dnc 10:1")` - Parsed from string (requires alias resolution)

### Example Test Patterns

#### Navigation Testing

```typescript
test("should navigate between verses", async () => {
    const initialState = helper.getAppState();
    await helper.pressArrowRight();
    const newState = helper.getAppState();
    expect(newState.verseReference).not.toBe(initialState.verseReference);
});
```

#### Mode Testing

```typescript
test("should enter insert mode", async () => {
    await helper.goTo();
    expect(helper.getMode()).toBe("insert");

    const state = helper.getAppState();
    expect(state.showInsertBuffer).toBe(true);
    expect(state.inputAction).toBe("goto");
});
```

#### Complex Workflows

```typescript
test("should handle complex user interaction", async () => {
    // Navigate to verse
    await helper.goTo();
    await helper.typeAndEnter("dnc 10:1");

    // Bookmark it
    await helper.toggleBookmark();

    // Enter select mode and link
    await helper.enterSelectMode();
    await helper.pressArrowRight();
    await helper.pressKey("l");
    await helper.typeAndEnter("dnc 20:1");

    // Verify final state
    const state = helper.getAppState();
    expect(state.isBookMarked).toBe(true);
    expect(state.verseReference).toContain("10:1");
});
```

## Running Tests

```bash
bun test src/App.e2e.test.ts
```

The test framework properly mocks the terminal environment so tests run quickly and don't interfere with your actual terminal session.
