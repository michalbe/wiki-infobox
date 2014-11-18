### Testing ###
If you are interested in contributing:

```bash
#clone the repo
$ git clone git@github.com:michalbe/wiki-infobox.git
$ cd wiki-infobox

#install all the dependencies
$ npm install

#to run jshint:
$ npm run lint

#to run tests
$ npm test
```

Tests & linter are hooked to commit (using [precommit-hook](https://github.com/nlf/precommit-hook)), so you cannot commit if linter is not passing or there are failing tests. If you need to do that anyway:
```bash
$ git commit -n
```
To mock the request connection I used [Nock](https://github.com/pgte/nock). Together with the templates & helpers prepared in `/tests/mocks/` it's possible to manipulate fake wikipedia API responses to fit requirements of the given test.
