export class MapParser {
    static stringify<T1, T2>(m: Map<T1, T2>): string {
        return JSON.stringify(m, MapParser.replacer);
    }
    static parse<T1, T2>(s: string): Map<T1, T2> {
        return JSON.parse(s, MapParser.reviver);
    }

    private static replacer(key: any, value: any) {
        if (value instanceof Map) {
            return {
                dataType: "Map",
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }
    private static reviver(key: any, value: any) {
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                return new Map(value.value);
            }
        }
        return value;
    }
}
