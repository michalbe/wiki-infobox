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
};

// Simple infobox with one string field
initMock(require('./mocks/1.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(data, {name: 'Bemowo'});
});

// Simple infobox with one link field
initMock(require('./mocks/2.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { 'settlement_type':
      { 'type' : 'link',
        'text' : 'Warsaw',
        'url' : 'http://en.wikipedia.org/wiki/Warsaw'
      }
    }
  );
});

// Simple infobox with one link field with alias
initMock(require('./mocks/3.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { 'subdivision_type1' :
      { 'type' : 'link',
        'text' : 'Voivodeship',
        'url' : 'http://en.wikipedia.org/wiki/Voivodeships of Poland'
      }
    }
  );
});

// Infobox with multiple links in one field
initMock(require('./mocks/4.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { 'country':
      [
        { 'type' : 'link',
          'text' : 'Warsaw',
          'url' : 'http://en.wikipedia.org/wiki/Warsaw'
        },
        { 'type' : 'link',
          'text':'Poland',
          'url' : 'http://en.wikipedia.org/wiki/Poland'
        }
      ]
    }
  );
});

// Infobox with multiple links (simple & with aliases) in one field
initMock(require('./mocks/5.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { 'languages':
      [
        { 'type' : 'link',
          'text' : 'Official language',
          'url' : 'http://en.wikipedia.org/wiki/Official language'
        },
        { 'type' : 'link',
          'text':'Polish',
          'url' : 'http://en.wikipedia.org/wiki/Polish language'
        }
      ]
    }
  );
});

// Infobox with one image field
initMock(require('./mocks/6.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { 'map':
      { 'type' : 'image',
        'text' : 'frameless',
        'url' : 'http://en.wikipedia.org/wiki/File:Metro w Warszawie linia.svg'
      }
    }
  );
});
