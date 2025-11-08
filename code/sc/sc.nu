#!/usr/bin/env nu

def main [] {
    help main
}

def 'main src' [] {
    open /Users/tristanbarrow/Scriptures/code/scripture-server/res/standard-works.sqlite 
    | query db "drop table hello_world;"
}
