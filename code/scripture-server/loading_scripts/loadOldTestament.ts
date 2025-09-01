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

// Configuration
const CONFIG = {
    source: "ot",
    sourceName: "Old Testament",
    fileName: "ot.json",
    emoji: "📜",
    progressInterval: 5000,
    createDatabase: false,
};

const dbPath =
    "/Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite";
const dataPath = `/Users/tristanbarrow/Scriptures/code/scripture-server/res/${CONFIG.fileName}`;

console.log(
    `🗄️  ${CONFIG.createDatabase ? "Setting up" : "Connecting to"} database...`,
);
const db = new Database(dbPath, { create: CONFIG.createDatabase });

if (CONFIG.createDatabase) {
    // Drop and recreate tables (only for Book of Mormon)
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
} else {
    // Check if verses table exists
    const tableExists = db
        .prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='verses'",
        )
        .get();

    if (!tableExists) {
        console.log(
            "❌ Verses table doesn't exist! Please run loadBookOfMormon.ts first.",
        );
        process.exit(1);
    }
}

// Prepare insert statement
const insertQuery = db.prepare(`INSERT INTO verses (
  source,
  book,
  chapter,
  verse,
  content
) VALUES (?, ?, ?, ?, ?)`);

// Load and process verses
console.log(`${CONFIG.emoji} Loading ${CONFIG.sourceName} data...`);
const file = Bun.file(dataPath);
const verses = (await file.json()) as Verse[];

console.log(`📊 Found ${verses.length} verses to process`);

// Transform verses to database format
const insert_verses = verses.map(({ text, reference }): LongVerse => {
    // Parse reference like "Genesis 1:1" into parts
    const parts = reference.split(" ");
    const chapterVerse = parts[parts.length - 1]?.split(":") || ["0", "0"];
    const bookName = parts.slice(0, -1).join(" ");

    return {
        source: CONFIG.source,
        content: text,
        book: bookName,
        chapter: parseInt(chapterVerse[0] || "0"),
        verse: parseInt(chapterVerse[1] || "0"),
    };
});

console.log(`🔄 Processing ${CONFIG.sourceName} verses...`);

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
        if (processed % CONFIG.progressInterval === 0) {
            console.log(
                `📝 Processed ${processed}/${insert_verses.length} verses...`,
            );
        }
    }
}

console.log(
    `✅ Successfully inserted ${processed} ${CONFIG.sourceName} verses into database`,
);

// Verify the data
const totalCount = db.query("SELECT COUNT(*) as count FROM verses").get() as {
    count: number;
};
console.log(`🔍 Database now contains ${totalCount.count} total verses`);

// Show counts by source
const sources = ["bofm", "nt", "ot", "dc", "pgp"];
const sourceNames = [
    "Book of Mormon",
    "New Testament",
    "Old Testament",
    "Doctrine and Covenants",
    "Pearl of Great Price",
];
const sourceEmojis = ["📖", "📚", "📜", "📜", "📿"];

for (let i = 0; i < sources.length; i++) {
    const count = db
        .query(`SELECT COUNT(*) as count FROM verses WHERE source = ?`)
        .get(sources[i]) as { count: number };
    if (count.count > 0) {
        console.log(
            `${sourceEmojis[i]} ${sourceNames[i]} verses: ${count.count}`,
        );
    }
}

// Show sample data
console.log(`\n📋 Sample ${CONFIG.sourceName} verses:`);
const sampleVerses = db
    .query(`SELECT * FROM verses WHERE source = ? LIMIT 5`)
    .all(CONFIG.source);
console.table(sampleVerses);

db.close();
console.log("🔐 Database connection closed.");
