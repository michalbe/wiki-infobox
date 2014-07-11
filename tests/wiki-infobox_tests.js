'use strict';

var wikiInfobox = require('../index');

var nock = require('nock');
var assert = require('assert');

var language = 'en';
var page = 'Bemowo';

var initMock = function(body) {
  nock('http://'+ language + '.wikipedia.org')
  .get(
    '/w/api.php?' +
    'format=json&' +
    'action=query&' +
    'prop=revisions&' +
    'rvprop=content&' +
    'titles='+page
  ).reply(200, body);
}

initMock(require('./mocks/1.js'));
wikiInfobox('Bemowo','en', function(err, data) {
  assert.deepEqual(data, {name: 'Bemowo'});
});
