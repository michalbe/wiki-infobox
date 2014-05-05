var request = require('request');

var page = "Warsaw";
var apiURL = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=" + page;

request.get(apiURL, function(error, data, body){
  if (error) {
    console.log('ERROR: ', error);
    return;
  }

  body = JSON.parse(body);
  console.log(body);
});
