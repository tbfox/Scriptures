if not ('~/.bin' | path exists) {
    ^mkdir -p ~/.bin
}

if ('~/.database/ss' | path exists) {
    rm -rf ~/.database/ss
}

^mkdir -p ~/.database/ss/

if ('./ss' | path exists) {
    mv ./ss ~/.bin
} else {
    print "could not find binary 'ss'"
}

cp -r ./res/* ~/.database/ss
