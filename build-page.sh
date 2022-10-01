#! /usr/bin/bash

# minify css and js
uglifyjs  ./scripts/main.js -o ./scripts/main.min.js
uglifyjs  ./scripts/ga.js -o ./scripts/ga.min.js
uglifyjs  ./scripts/commands.js -o ./scripts/commands.min.js
uglifyjs  ./scripts/splatnet.js -o ./scripts/splatnet.min.js
uglifyjs  ./scripts/anarchy.js -o ./scripts/anarchy.min.js
uglifyjs  ./scripts/anarchy-const.js -o ./scripts/anarchy-const.min.js
uglifyjs  ./scripts/cookies.js -o ./scripts/cookies.min.js
uglifycss ./styles/font.css > ./styles/font.min.css
uglifycss ./styles/img.css > ./styles/img.min.css
uglifycss ./styles/color.css > ./styles/color.min.css
uglifycss ./styles/index.css > ./styles/index.min.css

cur=$(date +%s)

# prevent cache
sed -e "s/js?v={BUILD_TIMESTAMP}/min.js?v=${cur}/g" \
    -e "s/css?v={BUILD_TIMESTAMP}/min.css?v=${cur}/g" \
    idea/index.html > index.html

sed -e "s/js?v={BUILD_TIMESTAMP}/min.js?v=${cur}/g" \
    -e "s/css?v={BUILD_TIMESTAMP}/min.css?v=${cur}/g" \
    idea/about.html > about.html

sed -e "s/js?v={BUILD_TIMESTAMP}/min.js?v=${cur}/g" \
    -e "s/css?v={BUILD_TIMESTAMP}/min.css?v=${cur}/g" \
    idea/anarchy.html > anarchy.html
