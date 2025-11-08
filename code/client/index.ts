import { health } from "./src/health";

export class ScriptureServerClient {
    private base: string
    constructor(base: string) {
        this.base = base;
    }
    search() {
        
    }
    reSearch() {}
    ref() {}
    async health() { return await health("bob") }
}

