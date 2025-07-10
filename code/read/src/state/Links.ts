import { Resource } from "./Resource";

export type LinkState = {
    word: number;
    to: string;
}[];

type Link = {
    from: Resource;
    word: number;
    to: Resource;
};

type LinkStorage = Map<string, LinkState>;

export class Links {
    private storedLinks: LinkStorage = new Map();
    add({ from, word, to }: Link) {
        const fromId = Resource.getId(from);
        const toId = Resource.getId(to);
        const stored = this.storedLinks.get(fromId);
        if (stored === undefined) {
            this.storedLinks.set(fromId, [{ word, to: toId }]);
        } else {
            stored.push({ word, to: toId });
            stored.sort();
            this.storedLinks.set(fromId, stored);
        }
    }
    remove({ from, word: in_word, to }: Link) {
        const fromId = Resource.getId(from);
        const toId = Resource.getId(to);
        let stored = this.storedLinks.get(fromId);

        if (stored === undefined) return;

        stored = stored.filter(
            ({ to, word }) => to !== toId || word !== in_word
        );

        if (stored.length === 0) this.storedLinks.delete(fromId);
        else this.storedLinks.set(fromId, stored);
    }
    getState(from: Resource): number[] {
        const fromId = Resource.getId(from);
        const arr = this.storedLinks.get(fromId) || [];
        return arr.map((l) => l.word);
    }
}
