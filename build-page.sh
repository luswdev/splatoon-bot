#! /usr/bin/bash

JS_LIST=(
    main
    i18n
    ga
    commands
    splatnet
    anarchy
    anarchy-const
    cookies
)

CSS_LIST=(
    font
    img
    color
    index
)

HTML_LIST=(
    index
    about
    anarchy
)

TOTAL_LENS=$((${#JS_LIST[@]}+${#CSS_LIST[@]}+${#HTML_LIST[@]}))
CURR_POS=0

get_precent() {
    local PERCENT=$((($CURR_POS*100)/$TOTAL_LENS))
    CURR_POS=$(($CURR_POS+1))
    return $PERCENT
}

# minify js
for js in "${JS_LIST[@]}"; do
get_precent
echo "[$?%] minify $js.js"
uglifyjs ./scripts/$js.js -o ./scripts/$js.min.js
done

#minify css
for css in "${CSS_LIST[@]}"; do
get_precent
echo "[$?%] minify $css.css"
uglifycss ./styles/$css.css > ./styles/$css.min.css
done

cur=$(date +%s)

# prevent cache
for html in "${HTML_LIST[@]}"; do
get_precent
echo "[$?%] update version tag of $html.html"
sed -e "s/js?v={BUILD_TIMESTAMP}/min.js?v=${cur}/g" \
    -e "s/css?v={BUILD_TIMESTAMP}/min.css?v=${cur}/g" \
    idea/$html.html > $html.html
done

echo "[$((($CURR_POS*100)/$TOTAL_LENS))%] done"
