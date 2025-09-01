# Scripture Loading Scripts

This directory contains standardized scripts for loading scripture data into the SQLite database.

## Scripts Overview

### Individual Loading Scripts

- **`loadBookOfMormon.ts`** - Loads Book of Mormon data (📖 6,604 verses)
    - **⚠️ Run this first!** - Creates the database and table structure
- **`loadNewTestament.ts`** - Loads New Testament data (📚 7,957 verses)
- **`loadOldTestament.ts`** - Loads Old Testament data (📜 23,145 verses)
- **`loadDoctrineAndCovenants.ts`** - Loads D&C data (📜 3,654 verses)
- **`loadPearlOfGreatPrice.ts`** - Loads Pearl of Great Price data (📿 635 verses)

### Master Script

- **`loadAllScriptures.ts`** - Loads all scriptures in the correct order

## Usage

### Load All Scriptures (Recommended)

```bash
bun run scripts/loadAllScriptures.ts
```

### Load Individual Scripts

```bash
# IMPORTANT: Always run Book of Mormon first!
bun run scripts/loadBookOfMormon.ts

# Then run any others in any order:
bun run scripts/loadNewTestament.ts
bun run scripts/loadOldTestament.ts
bun run scripts/loadDoctrineAndCovenants.ts
bun run scripts/loadPearlOfGreatPrice.ts
```

## Script Features

All scripts follow the same standardized pattern:

- ✅ Consistent error handling
- ✅ Progress reporting with appropriate intervals
- ✅ Database validation
- ✅ Comprehensive logging with emojis
- ✅ Sample data display
- ✅ Source counting summary

## Database Structure

```sql
CREATE TABLE verses (
    id INTEGER PRIMARY KEY,
    source TEXT,        -- 'bofm', 'nt', 'ot', 'dc', 'pgp'
    book TEXT,          -- Book name (e.g., "Genesis", "1 Nephi")
    chapter INTEGER,    -- Chapter number
    verse INTEGER,      -- Verse number
    content TEXT        -- Verse text
);
```

## Total Verses: 41,995

- 📖 Book of Mormon: 6,604
- 📚 New Testament: 7,957
- 📜 Old Testament: 23,145
- 📜 Doctrine and Covenants: 3,654
- 📿 Pearl of Great Price: 635
