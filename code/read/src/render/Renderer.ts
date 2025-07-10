import type { InputAction, OutputState } from "../state/State";
import { Cursor } from "./lib/Cursor";
import { Screen } from "./lib/Screen";
import { Style } from "./lib/Style";
import { VerseRenderer } from "./VerseRenderer";

function write(s: string) {
    process.stdout.write(s);
}

export class Renderer {
    draw({
        verseReference,
        verseText,
        isBookMarked,
        isUnsaved,
        buffer,
        showInsertBuffer,
        selectedWord,
        inputAction,
        error,
        links,
    }: OutputState) {
        Screen.erase();
        Cursor.home();
        this.renderReference(verseReference);
        if (isUnsaved) this.renderUnsaved();
        if (isBookMarked) this.renderIsMarked();
        if (error !== null) this.renderError(error);

        if (showInsertBuffer) this.renderTypingBuffer(buffer, inputAction);

        this.renderVerseText(verseText, selectedWord, links);
    }
    renderTypingBuffer(buffer: string, action: InputAction) {
        Cursor.home();
        Cursor.down(1);
        Style.bg(240);
        Style.fg(229);
        write(`${action}: ${buffer}`);
        Style.rmBg();
        Style.rmFg();
    }
    renderReference(verseRef: string) {
        Style.bg(235);
        Style.fg(43);
        write(this.capitalize(verseRef.replace("_", " ")));
        Style.rmBg();
        Style.rmFg();
    }
    renderUnsaved() {
        Style.bg(235);
        Style.fg(33);
        write(" *");
        Style.rmBg();
        Style.rmFg();
    }
    renderIsMarked() {
        Style.bg(235);
        Style.fg(208);
        write(" BM");
        Style.rmBg();
        Style.rmFg();
    }
    renderVerseText(
        text: string,
        selectedWord: number | null,
        links: number[]
    ) {
        const renderer = new VerseRenderer(text, selectedWord, links);
        renderer.renderVerse();
    }
    renderError(error: string) {
        Style.bg(237);
        Style.fg(196);
        write(error);
        Style.rmBg();
        Style.rmFg();
    }
    private capitalize(s: string) {
        return s
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }
}
