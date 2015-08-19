#!/bin/bash

# check if gh-pages files are commited
git checkout gh-pages
if [ ! -z "$(git status --porcelain)" ]; then 
  echo "There are uncommitted files on gh-pages. Please commit or stash first!"
  git status
  git checkout master
  exit 1
else 
  echo "All tracked files are commited. Publishing to gh-pages."
fi
git checkout master

# GITHUB PAGES PUBLISH

# generate build files
npm run build

# copy staged files to gh-pages
git checkout gh-pages
cp -R build/* .
rm -rf build

# add, commit and push files to gh-pages
git add -A
git commit -m "Publish tutorials."
git push origin gh-pages

# swap back to master branch
git checkout master
