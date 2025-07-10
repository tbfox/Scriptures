import type { InputAction, OutputState } from "../State";
import { Cursor } from "./Cursor";
import { Screen } from "./Screen";
import { Style } from "./Style";
import { VerseRenderer } from "./VerseRenderer";

function write(s: string) {
    process.stdout.write(s);
}

const cursor = new Cursor();
const screen = new Screen();
const style = new Style();

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
        screen.erase();
        cursor.home();
        this.renderReference(verseReference);
        if (isUnsaved) this.renderUnsaved();
        if (isBookMarked) this.renderIsMarked();
        if (error !== null) this.renderError(error);

        if (showInsertBuffer) this.renderTypingBuffer(buffer, inputAction);

        this.renderVerseText(verseText, selectedWord, links);
    }
    renderTypingBuffer(buffer: string, action: InputAction) {
        cursor.home();
        cursor.down(1);
        style.bg(240);
        style.fg(229);
        write(`${action}: ${buffer}`);
        style.rmBg();
        style.rmFg();
    }
    renderReference(verseRef: string) {
        style.bg(235);
        style.fg(43);
        write(this.capitalize(verseRef.replace("_", " ")));
        style.rmBg();
        style.rmFg();
    }
    renderUnsaved() {
        style.bg(235);
        style.fg(33);
        write(" *");
        style.rmBg();
        style.rmFg();
    }
    renderIsMarked() {
        style.bg(235);
        style.fg(208);
        write(" BM");
        style.rmBg();
        style.rmFg();
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
        style.bg(237);
        style.fg(196);
        write(error);
        style.rmBg();
        style.rmFg();
    }
    private capitalize(s: string) {
        return s
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }
}
