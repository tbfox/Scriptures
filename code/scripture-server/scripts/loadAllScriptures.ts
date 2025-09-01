#!/usr/bin/env bun

/**
 * Master script to load all scripture data into the SQLite database
 *
 * This script loads all five standard works in the correct order:
 * 1. Book of Mormon (creates the database)
 * 2. New Testament
 * 3. Old Testament
 * 4. Doctrine and Covenants
 * 5. Pearl of Great Price
 */

import { $ } from "bun";

console.log("🚀 Starting complete scripture database setup...\n");

const scripts = [
    { name: "Book of Mormon", file: "loadBookOfMormon.ts", creates: true },
    { name: "New Testament", file: "loadNewTestament.ts", creates: false },
    { name: "Old Testament", file: "loadOldTestament.ts", creates: false },
    {
        name: "Doctrine and Covenants",
        file: "loadDoctrineAndCovenants.ts",
        creates: false,
    },
    {
        name: "Pearl of Great Price",
        file: "loadPearlOfGreatPrice.ts",
        creates: false,
    },
];

for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📚 Step ${i + 1}/5: Loading ${script.name}`);
    console.log(`${"=".repeat(60)}`);

    try {
        await $`bun run scripts/${script.file}`;
        console.log(`✅ ${script.name} loaded successfully!`);
    } catch (error) {
        console.error(`❌ Failed to load ${script.name}:`, error);
        process.exit(1);
    }
}

console.log(`\n${"=".repeat(60)}`);
console.log("🎉 ALL SCRIPTURES LOADED SUCCESSFULLY!");
console.log(`${"=".repeat(60)}`);
console.log("\n📊 Your database now contains all LDS standard works:");
console.log("   📖 Book of Mormon");
console.log("   📚 New Testament");
console.log("   📜 Old Testament");
console.log("   📜 Doctrine and Covenants");
console.log("   📿 Pearl of Great Price");
console.log("\n🚀 Your scripture server is ready to use!");
