import { Database } from "bun:sqlite";

// Types
type Verse = {
    reference: string;
    text: string;
};

type LongVerse = {
    source: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
};

const path =
    "/Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite";

console.log("🗄️  Connecting to existing database...");
const db = new Database(path);

// Check if verses table exists
const tableExists = db
    .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='verses'",
    )
    .get();

if (!tableExists) {
    console.log(
        "❌ Verses table doesn't exist! Please run processVerses.ts first.",
    );
    process.exit(1);
}

// Prepare insert statement
const insertQuery = db.prepare(`INSERT INTO verses (
  source,
  book,
  chapter,
  verse,
  content
) VALUES (?, ?, ?, ?, ?)`);

// Load and process Pearl of Great Price verses
console.log("📖 Loading Pearl of Great Price data...");
const file = Bun.file(
    "/Users/tristanbarrow/Scriptures/code/scripture-server/res/pgp.json",
);
const verses = (await file.json()) as Verse[];

console.log(`📊 Found ${verses.length} verses to process`);

// Transform verses to database format
const insert_verses = verses.map(({ text, reference }): LongVerse => {
    // Parse reference like "Moses 1:1" or "Abraham 1:1" into parts
    const parts = reference.split(" ");
    const chapterVerse = parts[parts.length - 1]?.split(":") || ["0", "0"];
    const bookName = parts.slice(0, -1).join(" ");

    return {
        source: "pgp",
        content: text,
        book: bookName,
        chapter: parseInt(chapterVerse[0] || "0"),
        verse: parseInt(chapterVerse[1] || "0"),
    };
});

console.log("🔄 Processing Pearl of Great Price verses...");

function runInsert(verse: LongVerse) {
    try {
        insertQuery.run(
            verse.source,
            verse.book,
            verse.chapter,
            verse.verse,
            verse.content,
        );
    } catch (e) {
        console.error("Error inserting verse:", e);
        console.error("Verse data:", verse);
    }
}

// Insert all verses
let processed = 0;
for (let i = 0; i < insert_verses.length; i++) {
    const v = insert_verses[i];
    if (v) {
        runInsert(v);
        processed++;
        if (processed % 500 === 0) {
            console.log(
                `📝 Processed ${processed}/${insert_verses.length} verses...`,
            );
        }
    }
}

console.log(
    `✅ Successfully inserted ${processed} Pearl of Great Price verses into database`,
);

// Verify the data
const totalCount = db.query("SELECT COUNT(*) as count FROM verses").get() as {
    count: number;
};
console.log(`🔍 Database now contains ${totalCount.count} total verses`);

const pgpCount = db
    .query("SELECT COUNT(*) as count FROM verses WHERE source = 'pgp'")
    .get() as { count: number };
console.log(`📿 Pearl of Great Price verses: ${pgpCount.count}`);

const otCount = db
    .query("SELECT COUNT(*) as count FROM verses WHERE source = 'ot'")
    .get() as { count: number };
console.log(`📜 Old Testament verses: ${otCount.count}`);

const ntCount = db
    .query("SELECT COUNT(*) as count FROM verses WHERE source = 'nt'")
    .get() as { count: number };
console.log(`📚 New Testament verses: ${ntCount.count}`);

const bofmCount = db
    .query("SELECT COUNT(*) as count FROM verses WHERE source = 'bofm'")
    .get() as { count: number };
console.log(`📖 Book of Mormon verses: ${bofmCount.count}`);

// Show sample PGP data
console.log("\n📋 Sample Pearl of Great Price verses:");
const sampleVerses = db
    .query("SELECT * FROM verses WHERE source = 'pgp' LIMIT 5")
    .all();
console.table(sampleVerses);

db.close();
console.log("🔐 Database connection closed.");
