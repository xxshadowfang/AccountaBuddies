#!/bin/bash

curBranch=$(git rev-parse --abbrev-ref HEAD)

# Stash unstaged.
[[ $curBranch != '(no branch)' ]] &&
git stash -q --keep-index &&
mocha AccountaBuddies/test/bootstrap.test.js AccountaBuddies/test/**/*.test.js

# Check the exit status of grunt.
[[ $? -ne 0 ]] &&
echo "Test failed, can't commit" &&
git stash pop -q
exit 1

# Tests passed, good to commit
git add .
git stash pop -q