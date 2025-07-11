import { readFileSync } from "fs";

export class BookMarks {
    private bookmarks: string[] = [];
    private unsaved: boolean = false;
    has(ref: string) {
        return this.bookmarks.includes(ref);
    }
    add(ref: string) {
        this.bookmarks.push(ref);
        this.bookmarks.sort();
        this.unsaved = true;
    }
    remove(ref: string) {
        this.bookmarks = this.bookmarks.filter((b) => b !== ref);
        this.unsaved = true;
    }
    save() {
        const path = Bun.file(Bun.env.ROOT_DIR + "user-data/bookmarks.json");
        Bun.write(path, JSON.stringify(this.bookmarks));
        this.unsaved = false;
    }
    load() {
        this.bookmarks = JSON.parse(
            readFileSync(Bun.env.ROOT_DIR + "user-data/bookmarks.json", "utf-8")
        );
        this.unsaved = false;
    }
    hasUnsaved() {
        return this.unsaved;
    }
}
