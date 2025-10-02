#!/usr/bin/env nu

let BASE = 'http://localhost:3000/'

def 'query-string add' [key value] {
    if $value == null {
        $in
    } else {
        $"($in)&($key)=($value)"
    }
}

# Search the scriptures
def "main search" [
    --count-words       # Add word_count to response
    --count-chars       # Add char_count to response
    --no-punc           # Remove punctuation from content
    --reverse(-r)       # Reverse search
    --match(-m): string # Match this text exactly
    --take (-t): number # Size of the page or items to take
    --page(-p): number  # Page number to take
    --lower(-l)         # To lowercase
    --json(-j)          # Output as JSON
    --url               # Do not make the request, print the url instead
] {
    let searchBase = if $reverse {"r-search"} else {"search"}
    let fullUrl = $"($BASE)($searchBase)?" 
    | query-string add match $match
    | query-string add take $take
    | query-string add page $page
    | query-string add count_words $count_words
    | query-string add count_chars $count_chars
    | query-string add no_punc $no_punc
    | query-string add lower $lower

    if ($url) {
        print $fullUrl
    } else {
        http get $fullUrl 
        | merge { url: $fullUrl } 
        | if $json { to json } else { $in }
    }
}

# Display the health of the connection
def "main health" [] {
    http get $"($BASE)health" | select status
}

def main [] { print "Use -h for help" }
