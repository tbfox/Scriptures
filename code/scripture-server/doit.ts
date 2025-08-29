import { Database } from "bun:sqlite";

// Connect to the existing SQLite database
const db = new Database("./res/standard-works.sqlite");

try {
    // Query and display the data from hello_world table
    const selectStmt = db.prepare("SELECT * FROM hello_world ORDER BY id");
    const rows = selectStmt.all();

    console.log("📋 Data retrieved from hello_world table:");
    console.table(rows);

    console.log(`\n📊 Total rows: ${rows.length}`);

    // Get table info
    const tableInfo = db.prepare("PRAGMA table_info(hello_world)").all();
    console.log("\n🔧 Table structure:");
    console.table(tableInfo);
} catch (error) {
    console.error("❌ Error:", error);
} finally {
    // Close the database connection
    db.close();
    console.log("\n🔐 Database connection closed.");
}
