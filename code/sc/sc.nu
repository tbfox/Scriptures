#!/usr/bin/env nu

    # open /Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite 
    # | query db "SELECT DISTINCT source FROM verses;"
def main [] {
    help main
}

def 'main get' [source: string] {
    let s = main src | where id == $source
    if ($s | is-empty) {
        return $"Error: '($source)' is not a valid source."
    }

    open /Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite 
    | query db $"SELECT DISTINCT book FROM verses WHERE source = '($source)';"
}

def 'main src' [] {
    open /Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite 
    | query db "select id, title from sources"
}

def 'main run' [] {
    open /Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite 
    | query db "DROP TABLE verse_references;"
}
