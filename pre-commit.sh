git stash -q --keep-index

# Run tests
mocha AccountaBuddies/test/bootstrap.test.js AccountaBuddies/test/**/*.test.js

git stash pop -q