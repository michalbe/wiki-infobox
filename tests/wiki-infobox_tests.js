'use strict';

var nock = require('nock');
var wikiInfobox = require('../index');

var language = 'en';
var page = 'Bemowo';

nock('http://'+ language + '.wikipedia.org')
.get(
  'w/api.php?' +
  'format=json&' +
  'action=query&' +
  'prop=revisions&' +
  'rvprop=content&' +
  'titles='+page
).reply(200, 'Hello from Google!');


wikiInfobox('Bemowo','en', function(err, data){
  console.log(data);
  return 8;
});
