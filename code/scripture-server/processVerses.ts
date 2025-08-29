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

console.log("🗄️  Setting up database...");
const db = new Database(path, { create: true });

// Drop and recreate tables
db.run("DROP TABLE IF EXISTS verses;");

db.query(
    `CREATE TABLE verses (
    id INTEGER PRIMARY KEY,
    source TEXT,
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT
)`,
).run();

console.log("✅ Database tables created");

// Prepare insert statement
const insertQuery = db.prepare(`INSERT INTO verses (
  source,
  book,
  chapter,
  verse,
  content
) VALUES (?, ?, ?, ?, ?)`);

// Load and process Book of Mormon verses
console.log("📖 Loading Book of Mormon data...");
const file = Bun.file(
    "/Users/tristanbarrow/Scriptures/code/scripture-server/res/bofm.json",
);
const verses = (await file.json()) as Verse[];

console.log(`📊 Found ${verses.length} verses to process`);

// Transform verses to database format
const insert_verses = verses.map(({ text, reference }): LongVerse => {
    // Parse reference like "1_Nephi 1:1" into parts
    const s1 = reference.split(" ");
    const bookName = s1[0]?.replace(/_/g, " ") || "unknown_book";
    const chapterVerse = s1[1]?.split(":") || ["0", "0"];

    return {
        source: "bofm",
        content: text,
        book: bookName,
        chapter: parseInt(chapterVerse[0] || "0"),
        verse: parseInt(chapterVerse[1] || "0"),
    };
});

console.log("🔄 Processing verses...");

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
        if (processed % 1000 === 0) {
            console.log(
                `📝 Processed ${processed}/${insert_verses.length} verses...`,
            );
        }
    }
}

console.log(`✅ Successfully inserted ${processed} verses into database`);

// Verify the data
const countResult = db.query("SELECT COUNT(*) as count FROM verses").get() as {
    count: number;
};
console.log(`🔍 Database now contains ${countResult.count} verses`);

// Show sample data
console.log("\n📋 Sample verses:");
const sampleVerses = db.query("SELECT * FROM verses LIMIT 5").all();
console.table(sampleVerses);

db.close();
console.log("🔐 Database connection closed.");
