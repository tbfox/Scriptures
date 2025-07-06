import type { OutputState } from "../State";
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
    draw({ verseReference, verseText, isBookMarked, isUnsaved }: OutputState) {
        screen.erase();
        cursor.home();
        this.renderReference(verseReference);
        if (isUnsaved) this.renderUnsaved();
        if (isBookMarked) this.renderIsMarked();
        this.renderVerseText(verseText);
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
    renderVerseText(text: string) {
        const renderer = new VerseRenderer(text);
        renderer.renderVerse();
    }
    private capitalize(s: string) {
        return s
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }
}
