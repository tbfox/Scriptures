
type FlatVerse = { reference: string, text: string }


export const getVerseByReference = async (ref: string) => {
    const verses = await Bun.file(import.meta.dir + "/../res/bom.json").json() as FlatVerse[]
    const filtered = verses.filter(({ reference }) => reference === ref)
     
    if (filtered.length === 0) throw `Verse for reference '${ref}' does not exist.`
    const reference = filtered[0]?.reference.split('_').join(" ")
    const text = filtered[0]?.text

    return { reference, text }
};
