var request = require('request');
//var XRegExp = require('xregexp').XRegExp;

var page = "Warsaw";
var apiURL = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=" + page;

request.get(apiURL, function(error, data, body){
  if (error) {
    console.log('ERROR: ', error);
    return;
  }

  var content = JSON.parse(body);
  content = content.query.pages;

  var page = Object.keys(content);
  content = content[page].revisions[0]['*'];

  //var regex = XRegExp("\{\{\s*[Ii]nfobox +.*.*\}\}", "s");
  //var data = XRegExp.exec(content, regex);

  var startingPointRegex = /\{\{\s*[Ii]nfobox/;

  var macz = content.match(startingPointRegex).index;

  console.log(content.substr(macz, content.length);
});
