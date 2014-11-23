'use strict';

var wikiInfobox = require('../index');

var nock = require('nock');
var assert = require('assert');

var language = 'en';
var page = 'Bemowo';
var oldPage;

var initMock = function(body) {
  nock('http://'+ language + '.wikipedia.org')
  .get(
    '/w/api.php?' +
    'format=json&' +
    'action=query&' +
    'prop=revisions&' +
    'rvprop=content&' +
    'titles='+encodeURIComponent(page)
  ).reply(200, body);
};

// Simple infobox with one string field
initMock(require('./mocks/1.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(data, {name: {type:'text',value:'Bemowo'}});
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

// Infobox with one text field, multiple links in one field, link with
// alias & image
initMock(require('./mocks/7.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    { owner:
      {
        type: 'text',
        value: 'City of Warsaw'
      },
      locale: [
        {
          type: 'link',
          text: 'Warsaw',
          url: 'http://en.wikipedia.org/wiki/Warsaw'
        },
        {
          type: 'link',
          text: 'Poland',
          url: 'http://en.wikipedia.org/wiki/Poland'
        }
      ],
      transit_type: {
        type: 'link',
        text: 'Rapid',
        url: 'http://en.wikipedia.org/wiki/Rapid transit'
      },
      map: {
        type: 'image',
        text: 'frameless',
        url: 'http://en.wikipedia.org/wiki/File:Metro w Warszawie linia.svg'
      },
      logo: {
        type: 'image',
        text: 'Image:Warsaw Metro logo.svg',
        url: 'http://en.wikipedia.org/wiki/Image:Warsaw Metro logo.svg'
      }
    }
  );
});

// Test without infobox
initMock(require('./mocks/8.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(err.message, 'No infobox found!');
});

//Test with text mixed with complex data
initMock(require('./mocks/9.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(
    data,
    {
      'num_episodes':
      [{
        type: 'text',
        value: '139 ('
      },
      {
        type: 'link',
        text: 'List of episodes',
        url: 'http://en.wikipedia.org/wiki/List of MacGyver episodes'
      },
      {
        type: 'text',
        value: ')<br />2 TV '
      },
      {
        type: 'link',
        text: 'films',
        url: 'http://en.wikipedia.org/wiki/List of MacGyver episodes#TV Movies'
      }]
    }
  );
});

// Test special chars in the title
oldPage = page;
page='Franklin & Bash';
initMock(require('./mocks/10.js'));
wikiInfobox(page, language, function(err, data) {
  assert.deepEqual(data, {name: {type:'text',value:'Franklin & Bash'}});
});
page = oldPage;

// Pages that are not proper Wikipedia pages
initMock(require('./mocks/11.js'));
wikiInfobox(page, language, function(err, data) {
  assert.ok(err);
  assert.equal(data, undefined);
});
