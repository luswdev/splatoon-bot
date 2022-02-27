#! /usr/bin/zsh

cur=$(date +'%Y%m%d%H%M%S')

sed "s/{BUILD_TIMESTAMP}/${cur}/g" idea/about.html | tee about.html
sed "s/{BUILD_TIMESTAMP}/${cur}/g" idea/index.html | tee index.html
